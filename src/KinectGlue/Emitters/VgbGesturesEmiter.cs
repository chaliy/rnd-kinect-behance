using Eleks.KinectBehance.Contracts.Events;
using Eleks.KinectBehance.KinectGlue.AppEvents;
using Microsoft.Kinect.VisualGestureBuilder;
using System;
using System.Collections.Generic;
using System.IO;
using System.Reactive.Subjects;
using System.Reflection;

namespace Eleks.KinectBehance.KinectGlue.Emitters
{
    public class VgbGesturesEmiter
    {
        readonly Subject<GestureDetected> gestureDetectedSubject = new Subject<GestureDetected>();
        VisualGestureBuilderDatabase _gestureDatabase;
        VisualGestureBuilderFrameSource _gestureFrameSource;
        VisualGestureBuilderFrameReader _gestureFrameReader;        
        static readonly float MinConfidence = 0.4F;
        static readonly float PeakConfidence = 0.7F;

        readonly IDictionary<string, GestureState> _states = new Dictionary<string, GestureState>();

        class GestureState
        {

            Gesture _gesture;
            float _normalization;
            State _state;
            float _lastConfidence;
            Action<string> _callback;

            public GestureState(Gesture gesture, float normalization, Action<string> callback)
            {
                _gesture = gesture;
                _normalization = normalization;
                _callback = callback;
            }            

            public Gesture Gesture { get { return _gesture; } }

            public void UpadateState(DiscreteGestureResult result)
            {
                var confidence = result.Confidence * _normalization;
                if (_state == State.Pending && confidence > MinConfidence)
                {
                    _callback(_gesture.Name + "_Staring");
                    _state = State.Starting;
                }
                else if (_state == State.Starting 
                    && confidence > PeakConfidence 
                    && confidence < _lastConfidence)
                {
                    _callback(_gesture.Name);
                    _state = State.Peak;
                }
                else if (_state == State.Starting && confidence < MinConfidence * 1.2)
                {
                    _callback(_gesture.Name + "_Fail");
                    _state = State.Pending;
                }
                else if (_state == State.Peak && confidence < MinConfidence * 2.0)
                {
                    _callback(_gesture.Name + "_Ending");
                    _state = State.Ending;
                }
                else if (_state == State.Ending)
                {
                    _state = State.Pending;
                }
                else if (confidence < 0.1)
                {
                    _state = State.Pending;
                }

                _lastConfidence = result.Confidence;
            }
        }


        public VgbGesturesEmiter(IObservable<KinectChanged> kinectChanged, IObservable<TrackedBodyReady> trackedBody)
        {

            kinectChanged.Subscribe(e =>
            {
                if (e.NewSeonsor != null)
                {
                    var dbFileName = GetDbFileName();
                    Console.WriteLine("DB file: " + dbFileName);
                    _gestureDatabase = new VisualGestureBuilderDatabase(dbFileName);
                    _gestureFrameSource = new VisualGestureBuilderFrameSource(e.NewSeonsor, 0);

                    // Add all gestures in the database to the framesource..
                    _gestureFrameSource.AddGestures(_gestureDatabase.AvailableGestures);

                    foreach (var gesture in _gestureDatabase.AvailableGestures)
                    {
                        if (gesture.Name == "SwipeToLeft")
                        {
                            _states.Add(gesture.Name, new GestureState(gesture, 0.7f, OnGestureDetected));
                        }
                        else if (gesture.Name == "SwipeToRight")
                        {
                            _states.Add(gesture.Name, new GestureState(gesture, 1f, OnGestureDetected));
                        }
                    }

                    _gestureFrameReader = _gestureFrameSource.OpenReader();
                    _gestureFrameReader.FrameArrived += Reader_FrameArrived;
                }
            });

            trackedBody.Subscribe(e =>
            {
                _gestureFrameSource.TrackingId = e.Body.TrackingId;                
            });
        }

        public IObservable<GestureDetected> GestureDetected
        {
            get
            {
                return gestureDetectedSubject;
            }
        }

        private static string GetDbFileName()
        {
            var folder = Path.GetDirectoryName(
                Assembly.GetExecutingAssembly().Location
            );

            return Path.Combine(folder, @"Gestures\Swipes.gbd");
        }

        private void Reader_FrameArrived(object sender, VisualGestureBuilderFrameArrivedEventArgs e)
        {
            using (var frame = e.FrameReference.AcquireFrame())
            {
                if (frame != null/* && frame.DiscreteGestureResults != null */)
                {
                    foreach (var gestureState in _states.Values)
                    {
                        ProcessGestureResult(frame, gestureState);
                    }
                }
            }
        }

        private void ProcessGestureResult(VisualGestureBuilderFrame frame, GestureState state)
        {
            var result = frame.DiscreteGestureResults[state.Gesture];
            if (result.Detected == true)
            {
                state.UpadateState(result);
            }
        }

        private void OnGestureDetected(string gesture)
        {
            Console.WriteLine("Gesture detected: " + gesture);
            gestureDetectedSubject.OnNext(new GestureDetected
            {
                Name = gesture
            });
        }


        private enum State
        {
            Pending,
            Starting,
            Peak,
            Ending
        }
    }
}

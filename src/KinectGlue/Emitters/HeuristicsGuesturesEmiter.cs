namespace Eleks.KinectBehance.KinectGlue.Emitters
{
    using AppEvents;
    using Microsoft.Kinect;
    using System;
    using System.Reactive.Subjects;
    using HeuristicGestures;
    using System.Linq;
    using Eleks.KinectBehance.Contracts.Events;

    public class HeuristicsGuesturesEmitter
    {
        readonly Subject<GestureDetected> gestureDetectedSubject = new Subject<GestureDetected>();
        readonly Subject<GesturePointChanged> gesturePointChangedSubject = new Subject<GesturePointChanged>();
        readonly HeuristicGestureManager detectorManager = new HeuristicGestureManager();        

        public HeuristicsGuesturesEmitter(IObservable<TrackedBodyReady> bodyReady)
        {
            bodyReady.Subscribe(e => OnBodyReady(e.Body));

            detectorManager.OnGestureDetected += OnGestureDetected;
        }

        public IObservable<GestureDetected> GestureDetected
        {
            get
            {
                return gestureDetectedSubject;
            }
        }

        public IObservable<GesturePointChanged> GesturePointChanged
        {
            get
            {
                return gesturePointChangedSubject;
            }
        }

        void OnBodyReady(Body body)
        {
            detectorManager.ProcessFrame(body);
            if (detectorManager.Entries.Count > 0)
            {
                var current = detectorManager.Entries.Last(); ;
                gesturePointChangedSubject.OnNext(new GesturePointChanged
                {
                    Point = current.Position,
                    Entries = detectorManager.Entries.Select(x => x.Position).ToArray()
                });
            }
        }

        void OnGestureDetected(string gesture)
        {
            Console.WriteLine("Gesture detected: " + gesture);
            gestureDetectedSubject.OnNext(new GestureDetected
            {
                Name = gesture
            });
        }
    }
}

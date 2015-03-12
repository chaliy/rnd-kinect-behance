namespace Eleks.KinectBehance.KinectGlue
{
    using Eleks.KinectBehance.KinectGlue.AppEvents;
    using Microsoft.Kinect;
    using System;
    using System.Linq;
    using System.Reactive.Linq;
    using System.Reactive.Subjects;
    using System.Collections.Generic;

    public class KinectManager
    {
        readonly Subject<KinectChanged> kinectChangesObservable = new Subject<AppEvents.KinectChanged>();
        readonly Subject<TrackedBodyReady> bodyReadySubject = new Subject<TrackedBodyReady>();
        readonly Subject<BodiesReady> bodiesReadySubject = new Subject<BodiesReady>();

        KinectSensor sensor;
        MultiSourceFrameReader reader;
        IList<Body> cashedBodies;

        public KinectManager()
        {
            
        }

        public KinectSensor Kinect { get { return sensor;  } }

        private void Reader_MultiSourceFrameArrived(object sender, MultiSourceFrameArrivedEventArgs e)
        {
            var reference = e.FrameReference.AcquireFrame();

            // Body
            using (var frame = reference.BodyFrameReference.AcquireFrame())
            {
                if (frame != null)
                {
                    cashedBodies = new Body[frame.BodyFrameSource.BodyCount];

                    frame.GetAndRefreshBodyData(cashedBodies);

                    var trackedBodies = cashedBodies
                       .Where(x => x != null && x.IsTracked)
                       .ToList();

                    if (trackedBodies.Count == 1)
                    {
                        bodyReadySubject.OnNext(new TrackedBodyReady
                        {
                            Body = trackedBodies[0]
                        });
                    }

                    bodiesReadySubject.OnNext(new BodiesReady
                    {
                        Bodies = cashedBodies.ToArray()
                    });
                }
            }
        }

        public IObservable<KinectChanged> KinectChanged
        {
            get { return kinectChangesObservable; }
        }

        public IObservable<TrackedBodyReady> BodyReady
        {
            get { return bodyReadySubject; }
        }

        public IObservable<BodiesReady> BodiesReady
        {
            get { return bodiesReadySubject; }
        }

        public void Start()
        {
            sensor = KinectSensor.GetDefault();
            sensor.Open();

            reader = sensor.OpenMultiSourceFrameReader(FrameSourceTypes.Color | FrameSourceTypes.Depth | FrameSourceTypes.Infrared | FrameSourceTypes.Body);
            reader.MultiSourceFrameArrived += Reader_MultiSourceFrameArrived;

            kinectChangesObservable.OnNext(new AppEvents.KinectChanged(sensor, null));
        }

        public void Stop()
        {
            if (sensor != null)
            {
                sensor.Close();
            }
        }
    }
}

namespace Eleks.KinectBehance.KinectGlue
{
    using System;
    using System.Linq;
    using System.Reactive.Subjects;
    using AppEvents;
    using Microsoft.Kinect;
    using Eleks.KinectBehance.Contracts.Events;

    public class SinglePersonTracking
    {
        readonly Subject<TrackingChanged> trackingChangedSubject = new Subject<TrackingChanged>();

        ulong сurrentTrackingId;
        ulong bannedTrackingId;

        KinectSensor sensor;

        public SinglePersonTracking(IObservable<KinectChanged> kinectChanged, IObservable<BodiesReady> bodiesReady)
        {
            kinectChanged.Subscribe(e => sensor = e.NewSeonsor);
            bodiesReady.Subscribe(e => OnBodiesReady(e.Bodies));
        }

        public IObservable<TrackingChanged> TrackingChanged
        {
            get
            {
                return trackingChangedSubject;
            }
        }


        void OnBodiesReady(Body[] bodies)
        {            
            if (сurrentTrackingId != 0)
            {
                // We've been tracking someone; see if they're still here
                var skeletonStillTracked =
                    (from b in bodies
                     where b.IsTracked
                        && b.TrackingId == сurrentTrackingId
                        && b.TrackingId != bannedTrackingId
                     select b).Any();

                if (!skeletonStillTracked)
                {
                    // Nope, they're gone; forget him        
                    trackingChangedSubject.OnNext(new TrackingChanged
                    {
                        TrackingId = сurrentTrackingId,
                        Change = Contracts.Events.TrackingChanged.ChangeType.Lost
                    });

                    сurrentTrackingId = 0;
                    sensor.BodyFrameSource.OverrideHandTracking(0);
                }
            }
            else
            {
                // Try to find someone new
                var skeleton =
                    (from b in bodies
                     where b.IsTracked
                            && b.TrackingId != bannedTrackingId
                     orderby b.Joints[JointType.SpineBase].Position.Z
                     select b).FirstOrDefault();

                if (skeleton != null)
                {
                    // Found one; start tracking them
                    сurrentTrackingId = skeleton.TrackingId;
                    bannedTrackingId = 0;
                    sensor.BodyFrameSource.OverrideHandTracking(сurrentTrackingId);

                    trackingChangedSubject.OnNext(new TrackingChanged
                    {
                        TrackingId = сurrentTrackingId,
                        Change = Contracts.Events.TrackingChanged.ChangeType.Engadged
                    });
                }
            }
        }

        public void TrackAnother()
        {
            bannedTrackingId = сurrentTrackingId;
        }
    }
}

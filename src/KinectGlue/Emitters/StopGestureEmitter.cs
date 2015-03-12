namespace Eleks.KinectBehance.KinectGlue.Emitters
{
    using System;
    using System.Linq;
    using System.Reactive.Subjects;
    using Eleks.KinectBehance.Contracts.Events;
    using Eleks.KinectBehance.KinectGlue.AppEvents;
    using Microsoft.Kinect;

    public class StopGestureEmitter
    {
        readonly Subject<GestureDetected> gestureDetectedSubject = new Subject<GestureDetected>();

        ulong trackingId = 0;
        bool shouldDetect = false;

        public StopGestureEmitter(IObservable<TrackedBodyReady> bodyReady)
        {
            bodyReady.Subscribe(e => OnBodyReady(e.Body));
        }

        public IObservable<GestureDetected> GestureDetected
        {
            get
            {
                return gestureDetectedSubject;
            }
        }


        void OnBodyReady(Body body)
        {
            var result = DetectStopSkeleton(body);
            if (result == DetectionResult.Unknown)
            {
                return;
            }

            if (trackingId != body.TrackingId
                || result == DetectionResult.No)
            {
                shouldDetect = true;
            }

            if (shouldDetect && result == DetectionResult.Yes)
            {
                shouldDetect = false;
                gestureDetectedSubject.OnNext(new GestureDetected { Name = "Stop" });
            }

            trackingId = body.TrackingId;
        }

        public static DetectionResult DetectStopSkeleton(Body body)
        {
            if (!body.IsTracked)
            {
                return DetectionResult.Unknown;
            }

            var head = body.Joints[JointType.Head];
            var leftHand = body.Joints[JointType.HandLeft];
            var rightHand = body.Joints[JointType.HandRight];
            var leftElbow = body.Joints[JointType.ElbowLeft];
            var rightElbow = body.Joints[JointType.ElbowRight];

            if (head == default(Joint)
                || leftHand == default(Joint) || rightHand == default(Joint)
                || leftElbow == default(Joint) || rightElbow == default(Joint))
            {
                return DetectionResult.Unknown;
            }

            if (leftHand.Position.X > rightHand.Position.X
                && leftElbow.Position.X < rightElbow.Position.X
                && leftHand.Position.Y - rightElbow.Position.Y > 0.1f                
                && rightHand.Position.Y - leftElbow.Position.Y > 0.1f
                && leftHand.Position.Y < head.Position.Y
                && rightHand.Position.Y < head.Position.Y
                && rightHand.Position.X < head.Position.X
                && leftHand.Position.X < head.Position.X)
            {
                return DetectionResult.Yes;
            }
            return DetectionResult.No;
        }
    }
}

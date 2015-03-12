using System;
using System.Reactive.Subjects;
using Eleks.KinectBehance.Contracts.Events;
using Eleks.KinectBehance.KinectGlue.AppEvents;
using Microsoft.Kinect;

namespace Eleks.KinectBehance.KinectGlue.Emitters
{
    public class LikeGestureEmitter
    {
        readonly Subject<GestureDetected> gestureDetectedSubject = new Subject<GestureDetected>();

        ulong trackingId = 0;
        bool canLike = false;
        int counter = 0;

        public LikeGestureEmitter(IObservable<TrackedBodyReady> bodyReady)
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
            if (trackingId != body.TrackingId)
            {
                canLike = true;
                counter = 0;
            }

            if (canLike && IsLikingNow(body))
            {
                // Empirical value to reduce false positives
                if (counter > 10)
                {
                    gestureDetectedSubject.OnNext(new GestureDetected {Name = "Like"});
                    canLike = false;
                    counter = 0;
                }
                counter++;
            }
            else
            {
                counter = 0;
            }

            trackingId = body.TrackingId;
        }

        bool IsLikingNow(Body body)
        {
            var rightHand = body.Joints[JointType.HandRight];
            var spineMid = body.Joints[JointType.SpineMid];
            if (rightHand != default(Joint) && spineMid != default(Joint))
            {
                var distance = Math.Abs(rightHand.YDistance(spineMid));

                if (distance < 0.3 && body.HandRightState == HandState.Lasso
                    && body.HandRightConfidence == TrackingConfidence.High)
                {
                    return true;
                }
            }

            
            return false;
        }
    }
}

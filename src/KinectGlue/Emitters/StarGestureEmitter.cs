using System;
using System.Reactive.Subjects;
using Eleks.KinectBehance.Contracts.Events;
using Eleks.KinectBehance.KinectGlue.AppEvents;
using Microsoft.Kinect;

namespace Eleks.KinectBehance.KinectGlue.Emitters
{
    public class StarGestureEmitter
    {
        readonly Subject<GestureDetected> gestureDetectedSubject = new Subject<GestureDetected>();
        
        ulong trackingId = 0;
        bool canStar = false;

        public StarGestureEmitter(IObservable<TrackedBodyReady> bodyReady)
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

            var head = body.Joints[JointType.Head];
            var leftHand = body.Joints[JointType.HandLeft];
            var rightHand = body.Joints[JointType.HandRight];

            if (head == default(Joint) || leftHand == default(Joint) || rightHand == default(Joint))
            {
                return;
            }

            if (trackingId != body.TrackingId
                || IsHandsDown(head, leftHand, rightHand))
            {
                canStar = true;
            }

            if (IsHandsUp(head, leftHand, rightHand))
            {
                if (canStar)
                {
                    canStar = false;
                    gestureDetectedSubject.OnNext(new GestureDetected { Name = "Star" });
                }           
            }

            trackingId = body.TrackingId;
        }

        private static bool IsHandsUp(Joint head, Joint leftHand, Joint rightHand)
        {
            return (leftHand.Position.Y > head.Position.Y && rightHand.Position.Y > head.Position.Y)
                && (XDistance(leftHand, head) > 0.3f && XDistance(rightHand, head) > 0.3f);
        }

        private static bool IsHandsDown(Joint head, Joint leftHand, Joint rightHand)
        {
            return (leftHand.Position.Y < head.Position.Y && rightHand.Position.Y < head.Position.Y);
        }

        private static double XDistance(Joint j1, Joint j2)
        {
            return Math.Abs(j1.Position.X - j2.Position.X);
        }
    }
}

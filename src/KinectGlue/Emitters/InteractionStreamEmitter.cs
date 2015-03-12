namespace Eleks.KinectBehance.KinectGlue.Emitters
{
    using System;
    using System.Reactive.Subjects;
    using AppEvents;
    using Contracts.Events;
    using Contracts.Primitives.Interaction;
    using Microsoft.Kinect;

    public class InteractionStreamEmitter
    {
        readonly Subject<InteractionChanged> interactionChangedSubject = new Subject<InteractionChanged>();
        
        public InteractionStreamEmitter(IObservable<TrackedBodyReady> bodyReady)
        {
            bodyReady.Subscribe(e => OnBodyReady(e.Body));
        }

        public IObservable<InteractionChanged> InteractionChanged
        {
            get
            {
                return interactionChangedSubject;
            }
        }

        void OnBodyReady(Body body)
        {
            var rightPosition = body.Joints[JointType.HandRight].Position;
            var leftPosition = body.Joints[JointType.HandLeft].Position;

            var e = new InteractionChanged
            {
                Right = new HandPointer
                {
                    IsGripped = body.HandRightState == HandState.Closed,
                    State = body.HandRightState.ToString(),
                    X = rightPosition.X,
                    Y = rightPosition.Y
                },
                Left = new HandPointer
                {
                    IsGripped = body.HandLeftState == HandState.Closed,
                    State = body.HandLeftState.ToString(),
                    X = leftPosition.X,
                    Y = leftPosition.Y
                }
            };

            interactionChangedSubject.OnNext(e);
        }
    }
}

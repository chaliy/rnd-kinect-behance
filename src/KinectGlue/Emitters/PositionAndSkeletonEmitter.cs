namespace Eleks.KinectBehance.KinectGlue.Emitters
{
    using AppEvents;
    using Microsoft.Kinect;
    using System;
    using System.Reactive.Subjects;
    using System.Linq;
    using System.Collections.Generic;
    using Eleks.KinectBehance.Contracts.Events;

    public class PositionAndSkeletonEmitter
    {
        readonly Subject<PositionChanged> positionChangedSubject = new Subject<PositionChanged>();
        readonly Subject<SkeletonChanged> skeletonChangedSubject = new Subject<SkeletonChanged>();
        readonly static ISet<JointType> JointsToTrack = new HashSet<JointType>
        {
            JointType.Head,
            JointType.SpineShoulder,
            JointType.HandLeft,
            JointType.WristLeft,
            JointType.ElbowLeft,
            JointType.ShoulderLeft,
            JointType.HandRight,
            JointType.WristRight,
            JointType.ElbowRight,
            JointType.ShoulderRight
        };
        

        public PositionAndSkeletonEmitter(IObservable<BodiesReady> bodiesReady)
        {
            bodiesReady.Subscribe(e => OnBodiesReady(e.Bodies));
        }

        public IObservable<PositionChanged> PositionChanged
        {
            get
            {
                return positionChangedSubject;
            }
        }

        public IObservable<SkeletonChanged> SkeletonChanged
        {
            get
            {
                return skeletonChangedSubject;
            }
        }

        void OnBodiesReady(Body[] bodies)
        {
            foreach(var body in bodies)
            {
                if (!body.IsTracked)
                {
                    continue;
                }

                positionChangedSubject.OnNext(new PositionChanged
                {
                    Position = body.Joints[JointType.SpineShoulder].Position
                });

                var skeletonJoints = body.Joints.Values
                    .Where(x => JointsToTrack.Contains(x.JointType))
                    .Select(x => new SkeletonChanged.SkeletonJoint
                    {
                        JointType = x.JointType,
                        Position = x.Position,
                        TrackingState = x.TrackingState
                    })
                    .ToArray();

                skeletonChangedSubject.OnNext(new SkeletonChanged
                {
                    Joints = skeletonJoints
                });
            }
        }

    }
}

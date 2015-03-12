namespace Eleks.KinectBehance.Contracts.Events
{
    using Microsoft.Kinect;

    public class SkeletonChanged
    {
        public class SkeletonJoint
        {
            public CameraSpacePoint Position { get; set; }
            public JointType JointType { get; set; }
            public TrackingState TrackingState { get; set; }
        }

        public SkeletonJoint[] Joints { get; set; }
    }
}

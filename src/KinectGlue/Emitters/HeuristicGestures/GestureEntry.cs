namespace Eleks.KinectBehance.KinectGlue.Emitters.HeuristicGestures
{
    using System;
    using Microsoft.Kinect;

    public class GestureEntry
    {
        readonly DateTime time;
        readonly CameraSpacePoint position;
        readonly Joint[] additionalJoints;

        public GestureEntry(DateTime time, CameraSpacePoint position, Joint[] additionalJoints = null)
        {
            this.time = time;
            this.position = position;
            this.additionalJoints = additionalJoints ?? new Joint[0];
        }

        public DateTime Time { get { return time; } }
        public CameraSpacePoint Position { get { return position; } }
        public Joint[] Joints { get { return additionalJoints; } }
    }
}

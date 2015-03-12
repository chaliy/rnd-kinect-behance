namespace Eleks.KinectBehance.Contracts.Events
{
    using Microsoft.Kinect;

    public class GesturePointChanged
    {
        public CameraSpacePoint Point { get; set; }
        public CameraSpacePoint[] Entries { get; set; }

        public override string ToString()
        {
            return "X: " + Point.X + " Y: " + Point.Y + " Z: " + Point.Z;
        }
    }
}

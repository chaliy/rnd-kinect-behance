namespace Eleks.KinectBehance.Contracts.Events
{
    using Microsoft.Kinect;

    public class PositionChanged
    {
        public CameraSpacePoint Position { get; set; }

        public override string ToString()
        {
            return "X: " + Position.X + " Y: " + Position.Y + " Z: " + Position.Z;
        }
    }
}

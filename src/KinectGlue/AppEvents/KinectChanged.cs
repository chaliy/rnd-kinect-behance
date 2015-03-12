using Microsoft.Kinect;
namespace Eleks.KinectBehance.KinectGlue.AppEvents
{
    public class KinectChanged
    {
        readonly KinectSensor newSensor;
        readonly KinectSensor oldSensor;

        public KinectChanged(KinectSensor newSensor, KinectSensor oldSensor)
        {
            this.newSensor = newSensor;
            this.oldSensor = oldSensor;
        }

        public KinectSensor NewSeonsor { get { return newSensor; } }
        public KinectSensor OldSeonsor { get { return oldSensor; } }
    }
}

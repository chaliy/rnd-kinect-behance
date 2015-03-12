namespace Eleks.KinectBehance.KinectGlue
{
    using System;
    using Microsoft.Kinect;

    public static class JointExtensions
    {
        public static float YDistance(this Joint @this, Joint other)
        {
            return Math.Abs(@this.Position.Y - other.Position.Y);
        }

        public static float XDistance(this Joint @this, Joint other)
        {
            return Math.Abs(@this.Position.X - other.Position.X);
        }        
    }
}

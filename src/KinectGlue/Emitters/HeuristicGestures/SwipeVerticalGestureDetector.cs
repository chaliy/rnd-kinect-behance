namespace Eleks.KinectBehance.KinectGlue.Emitters.HeuristicGestures
{
    using Microsoft.Kinect;
    using System;
    using System.Linq;
    using Utils;
    using System.Collections.Generic;

    public class SwipeVerticalGestureDetector : IHeuristicGestureDetector
    {
        public float SwipeMinimalHeight { get; set; }
        public float SwipeMaximalWidth { get; set; }
        public float SwipeMaximalZ { get; set; }
        public int SwipeMininalDuration { get; set; }
        public int SwipeMaximalDuration { get; set; }

        public SwipeVerticalGestureDetector()
        {
            SwipeMinimalHeight = 0.5f;
            SwipeMaximalWidth = 0.3f;
            SwipeMininalDuration = 250;
            SwipeMaximalDuration = 1000;
            SwipeMaximalZ = 0.2f;
        }

        public string DetectGesture(IEnumerable<GestureEntry> entries)
        {
            if (entries.Max(x => x.Position.X) - entries.Min(x => x.Position.X) > SwipeMaximalWidth)
            {
                // Outside of horizontal window
                return null;
            }

            if (entries.Max(x => x.Position.Y) - entries.Min(x => x.Position.Y) < SwipeMinimalHeight)
            {
                // Not enough height
                return null;
            }

            if (entries.Max(x => x.Position.Z) - entries.Min(x => x.Position.Z) > SwipeMaximalZ)
            {
                // Too big Z
                return null;
            }

            var totalMilliseconds = (entries.Max(x => x.Time) - entries.Min(x => x.Time)).TotalMilliseconds;
            if (totalMilliseconds >= SwipeMaximalDuration && totalMilliseconds <= SwipeMininalDuration)
            {
                // Too slow or too fast
                return null;
            }

            if (entries.Segments().All(x => x.Item1.Position.Y <= x.Item2.Position.Y))
            {
                // Points should go to the up direction
                return "SwipeToUp";
            }

            //if (entries.Segments().All(x => x.Item1.Position.Y => x.Item2.Position.Y))
            //{
            //    // Points should go to the up direction
            //    return "SwipeToDown";
            //}

            return null;
        }
    }
}

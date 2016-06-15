namespace Eleks.KinectBehance.KinectGlue.Emitters.HeuristicGestures
{   
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using Utils;

    public class SwipeHorizontalGestureDetector : IHeuristicGestureDetector
    {
        public float SwipeMinimalX { get; set; }
        public float SwipeMaximalY { get; set; }
        public int SwipeMininalDuration { get; set; }
        public int SwipeMaximalDuration { get; set; }
        public float SwipeMaximalZ { get; set; }

        public SwipeHorizontalGestureDetector()
        {
            SwipeMinimalX = 0.7f;
            SwipeMaximalY = 0.3f;
            SwipeMininalDuration = 250;
            SwipeMaximalDuration = 1500;
            SwipeMaximalZ = 0.4f;
        }

        public string DetectGesture(IEnumerable<GestureEntry> entries)
        {

            if (entries.Max(x => x.Position.X) - entries.Min(x => x.Position.X) < SwipeMinimalX)
            {
                // Outside of horizontal window
                return null;
            }

            if (entries.Max(x => x.Position.Y) - entries.Min(x => x.Position.Y) > SwipeMaximalY)
            {
                // Not enoyugh Y
                return null;
            }

            //if (entries.Max(x => x.Position.Z) - entries.Min(x => x.Position.Z) > SwipeMaximalZ)
            //{
            //    // Too big Z
            //    return null;
            //}

            var totalMilliseconds = (entries.Last().Time - entries.First().Time).TotalMilliseconds;
            if (totalMilliseconds >= SwipeMaximalDuration && totalMilliseconds <= SwipeMininalDuration)
            {
                // Too slow or too fast
                return null;
            }

            if (entries.Segments().All(x => x.Item2.Position.X - x.Item1.Position.X > -0.01f))
            {
                Console.WriteLine("SwipeToRight:" + entries.Count());
                // Points should go to the up direction
                return "SwipeToRight";
            }

            if (entries.Segments().All(x => x.Item2.Position.X - x.Item1.Position.X < 0.01f))
            {
                Console.WriteLine("SwipeToLeft:" + entries.Count());
                // Points should go to the up direction
                return "SwipeToLeft";
            }

            return null;
        }
    }
}

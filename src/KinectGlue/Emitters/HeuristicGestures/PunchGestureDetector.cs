namespace Eleks.KinectBehance.KinectGlue.Emitters.HeuristicGestures
{
    using System.Linq;
    using Utils;
    using System.Collections.Generic;

    public class PunchGestureDetector : IHeuristicGestureDetector
    {
        public float MaximalHeight { get; set; }
        public float MaximalWidth { get; set; }
        public int PunchMininalDuration { get; set; }
        public int PunchMaximalDuration { get; set; }
        public float PunchMinimalLength { get; set; }

        public PunchGestureDetector()
        {
            MaximalHeight = 0.4f;
            MaximalWidth = 0.4f;
            PunchMinimalLength = 0.3f;

            PunchMininalDuration = 250;
            PunchMaximalDuration = 1500;
        }

        public string DetectGesture(IEnumerable<GestureEntry> entries)
        {
            if (entries.Max(x => x.Position.X) - entries.Min(x => x.Position.X) > MaximalWidth)
            {
                return null;
            }

            if (entries.Max(x => x.Position.Y) - entries.Min(x => x.Position.Y) > MaximalHeight)
            {
                return null;
            }

            
            if (entries.Max(x => x.Position.Z) - entries.Min(x => x.Position.Z) < PunchMinimalLength)
            {
                return null;
            }

            var totalMilliseconds = (entries.Max(x => x.Time) - entries.Min(x => x.Time)).TotalMilliseconds;
            if (totalMilliseconds >= PunchMaximalDuration && totalMilliseconds <= PunchMininalDuration)
            {
                // Too slow or too fast
                return null;
            }

            if (!entries.Segments().All(x => x.Item1.Position.Z > x.Item2.Position.Z))
            {
                // Points should go to the up direction
                return null;
            }

            return "Punch";
        }
    }
}

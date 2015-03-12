namespace Eleks.KinectBehance.KinectGlue.Emitters.HeuristicGestures
{
    using Microsoft.Kinect;
    using System;
    using System.Collections.Generic;
    using System.Linq;

    public class HeuristicGestureManager
    {
        

        readonly Queue<GestureEntry> entries = new Queue<GestureEntry>();
        readonly IList<IHeuristicGestureDetector> detectors = new List<IHeuristicGestureDetector>
        {
            new SwipeHorizontalGestureDetector(),
            //new SwipeVerticalGestureDetector(),
            //new PunchGestureDetector()
        };

        public event Action<string> OnGestureDetected;

        DateTime lastGestureDate = DateTime.Now.AddSeconds(-10);

        public HeuristicGestureManager(int windowSize = 15)
        {
            WindowSize = windowSize;
            MinimalPeriodBetweenGestures = 1000;
        }

        public IReadOnlyList<GestureEntry> Entries
        {
            get { return entries.ToList(); }
        }

        public int MinimalPeriodBetweenGestures { get; set; }
        public int WindowSize { get; set; }

        public void ProcessFrame(Body body)
        {
            var entry = CreateEntry(body);
            if (entry != null)
            {
                AddEntry(entry);
            }
        }

        protected virtual GestureEntry CreateEntry(Body body)
        {
            var rightHand = body.Joints[JointType.HandRight];
            if (rightHand.TrackingState == TrackingState.Tracked)
            {
                return new GestureEntry(DateTime.Now, rightHand.Position, body.Joints.Values.ToArray());
            }
            
            return null;
        }

        private void AddEntry(GestureEntry entry)
        {
            if (DateTime.Now.Subtract(lastGestureDate).TotalMilliseconds < MinimalPeriodBetweenGestures)
            {
                return;
            }

            entries.Enqueue(entry);

            // Remove too old positions
            var timeWindow = DateTime.Now.AddMilliseconds(-(MinimalPeriodBetweenGestures * 2));
            while(entries.Count > WindowSize || (entries.Count != 0 && entries.Peek().Time < timeWindow))
            {
                entries.Dequeue();
            }

            if (entries.Count > 5)
            {
                // Look for gestures
                var slices = new List<IEnumerable<GestureEntry>>
                {
                    entries.Skip(entries.Count - 7),
                    entries,
                };

                var gesture = slices
                    .SelectMany(s => detectors.Select(d => new { Detector = d, Slice = s }))
                    .Select(_ => _.Detector.DetectGesture(_.Slice))
                    .FirstOrDefault(x => x != null);

                if (!String.IsNullOrEmpty(gesture))
                {
                    RaiseGestureDetected(gesture);
                }
            }
        }

        private void RaiseGestureDetected(string gesture)
        {
            if (OnGestureDetected != null)
            {
                OnGestureDetected(gesture);
            }

            lastGestureDate = DateTime.Now;

            entries.Clear();
        }
    }
}

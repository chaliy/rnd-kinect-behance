namespace Eleks.KinectBehance.KinectGlue.Emitters.HeuristicGestures
{
    using System.Collections.Generic;

    public interface IHeuristicGestureDetector
    {
        string DetectGesture(IEnumerable<GestureEntry> entries);
    }
}

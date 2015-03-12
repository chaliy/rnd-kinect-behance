namespace Eleks.KinectBehance.Contracts.Events
{
    using Primitives.Interaction;

    public class InteractionChanged
    {
        public HandPointer Left { get; set; }
        public HandPointer Right { get; set; }

        public override string ToString()
        {
            return "Left: " + ((Left != null) ? Left.ToString() : "N/A") + "; Right: " + ((Right != null) ? Right.ToString() : "N/A");
        }
    }
}

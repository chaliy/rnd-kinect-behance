namespace Eleks.KinectBehance.Contracts.Primitives.Interaction
{
    public class HandPointer
    {
        public string State { get; set; }
        public bool IsGripped { get; set; }
        public double X { get; set; }
        public double Y { get; set; }

        public override string ToString()
        {
            return State;
        }
    }
}
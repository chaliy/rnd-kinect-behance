namespace Eleks.KinectBehance.Contracts.Events
{
    public class GestureDetected
    {
        public string Name { get; set; }

        public override string ToString()
        {
            return Name;
        }
    }
}

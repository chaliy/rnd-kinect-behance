namespace Eleks.KinectBehance.Contracts.Events
{
    public class TrackingChanged
    {
        public ulong TrackingId { get; set; }
        public ChangeType Change { get; set; }

        public enum ChangeType
        {
            Engadged,
            Lost
        }

        public override string ToString()
        {
            return TrackingId + ": " + Change;
        }
    }
}

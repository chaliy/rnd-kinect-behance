namespace Eleks.KinectBehance.Contracts.Commands
{
    using System;

    public class RecordProjectLike
    {
        public string ProjectId { get; set; }
        public string ClientId { get; set; }
        public DateTimeOffset Timestamp { get; set; }

        public override string ToString()
        {
            return "ProjectID: " + ProjectId + " ClientID: " + ClientId + " TS: " + Timestamp;
        }
    }
}

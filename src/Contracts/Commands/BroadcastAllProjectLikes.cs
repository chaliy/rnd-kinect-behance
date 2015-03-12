namespace Eleks.KinectBehance.Contracts.Commands
{
    public class BroadcastAllProjectLikes
    {
        public string ClientId { get; set; }

        public override string ToString()
        {
            return "ClientID: " + ClientId;
        }
    }
}

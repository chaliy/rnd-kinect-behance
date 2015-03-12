namespace Eleks.KinectBehance.Contracts.Events
{
    public class ProjectLikeCountChanged
    {
        public string ProjectId { get; set; }
        public int LikeCount { get; set; }

        public override string ToString()
        {
            return "Project: " + ProjectId + " Likes: " + LikeCount;
        }
    }
}

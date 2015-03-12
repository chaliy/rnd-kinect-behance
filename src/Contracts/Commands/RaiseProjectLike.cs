namespace Eleks.KinectBehance.Contracts.Commands
{
    using System;

    public class RaiseProjectLike
    {
        public string ProjectId { get; set; }

        public override string ToString()
        {
            return "ProjectID: " + ProjectId;
        }
    }
}

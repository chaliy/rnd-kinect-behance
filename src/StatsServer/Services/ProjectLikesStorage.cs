namespace Eleks.KinectBehance.StatsServer.Services
{
    using System;
    using System.Linq;
    using Dapper;
    using Eleks.KinectBehance.Contracts.Primitives.Projects;
    using Infrastructure;

    public static class ProjectLikesStorage
    {
        private static void Ensure()
        {
            Db.Run(c =>
            {
                c.Execute(@"create table if not exists [ProjectLikes]([ProjectID] text, [ClientID] text, [Timestamp] text);", new { });
            });
        }

        public static void Record(string projectId, string clientId, DateTimeOffset timestamp)
        {
            Ensure();
            Db.Run(c =>
            {
                c.Execute(@"insert into ProjectLikes values (@ProjectID, @ClientID, @Timestamp)",
                          new { ProjectID = projectId, ClientID = clientId, Timestamp = timestamp });
            });
        }

        public static int LikeCount(object projectId)
        {
            Ensure();
            return Db.Run(c =>
            {
                return c.ExecuteScalar<int>(@"select count(*) from ProjectLikes where Projectid = @ProjectID", new { ProjectID = projectId });
            });
        }

        public static ProjectLikes[] AllLikes()
        {
            Ensure();
            return Db.Run(c =>
            {
                return c.Query<ProjectLikes>(@"select ProjectId, count(1) as LikesCount
                            from ProjectLikes
                            group by ProjectId");
            }).ToArray();
        }
    }
}

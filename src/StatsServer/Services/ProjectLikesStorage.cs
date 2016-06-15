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

        public static void LoadFakeLikes(string clientId)
        {
            Ensure();
            
            var projects = new [] {
                "17136289",
                "11894973",
                "18416995",
                "15313489",
                "89757",
                "98119",
                "94608",
                "2453715",
                "89909",
                "15628009",
                "15228809",
                "14573015",
                "15373141",
                "14350243",
                "15735307",
                "20940531",
                "16036635",
                "6886313",
                "20110033",
                "20761859",
                "20301049",
                "16525321",
                "20379627",
                "18422523",
                "10483331",
                "20854599",
                "144893",
                "21030195"
            };

            var likes = from p in projects
                        select new
                        {
                            ProjectId = p,
                            Timestamps = Enumerable.Range(0, new Random().Next(44)).Select(i => DateTimeOffset.Now.AddMinutes(-i))
                        };

            var records = likes.SelectMany(proj => proj.Timestamps.Select(stamp => new
            {
                ProjectID = proj.ProjectId,
                Timestamp = stamp,
                ClientID = clientId
            }));

            Db.Run(c =>
            {
                c.Execute(@"insert into ProjectLikes values (@ProjectID, @ClientID, @Timestamp)", records);
            });
        }

        public static ProjectLikes[] AllLikes()
        {
            //return new ProjectLikes[]
            //{
            //    new ProjectLikes
            //    {
            //        ProjectId = "w3434",
            //        LikesCount = 150
            //    },
            //    new ProjectLikes
            //    {
            //        ProjectId = "wer3",
            //        LikesCount = 45
            //    }
            //};

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

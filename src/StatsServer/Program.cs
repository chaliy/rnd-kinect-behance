namespace Eleks.KinectBehance.StatsServer
{
    using Contracts.Events;
    using Services;
    using System;
    using System.Threading;
    using System.Reactive.Linq;
    using Contracts.Commands;

    class Program
    {
        static void Main(string[] args)
        {
            var console = new ConsoleManager(args);
            var rnd = new Random();

            using (new ApiManager())
            using (var manager = new ServerManager())
            {
                manager.Start();

                manager.CommandReceived
                    .Subscribe(cmd => AuditStorage.Store(cmd));

                manager.CommandReceived
                    .OfType<RecordProjectLike>()
                    .Subscribe(cmd =>
                    {
                        ProjectLikesStorage.Record(cmd.ProjectId, cmd.ClientId, cmd.Timestamp);
                        var likeCount = ProjectLikesStorage.LikeCount(cmd.ProjectId);

                        manager.Send(new ProjectLikeCountChanged
                        {
                            ProjectId = cmd.ProjectId,
                            LikeCount = likeCount
                        });
                    });

                manager.CommandReceived
                    .OfType<BroadcastAllProjectLikes>()
                    .Subscribe(cmd =>
                    {
                        foreach (var pl in ProjectLikesStorage.AllLikes())
                        {
                            manager.Send(new ProjectLikeCountChanged
                            {
                                ProjectId = pl.ProjectId,
                                LikeCount = pl.LikesCount
                            });
                        }
                    });

                while (!console.IsCancelRequested)
                {
                    Thread.Sleep(TimeSpan.FromSeconds(1));
                }
            }
        }
    }
}

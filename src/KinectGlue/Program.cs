namespace Eleks.KinectBehance.KinectGlue
{
    using Emitters;
    using System;
    using System.Reactive.Linq;
    using System.Threading;
    using Contracts.Events;
    using Contracts.Commands;

    class Program
    {
        static void Main(string[] args)
        {
            var console = new ConsoleManager(args);
            var rnd = new Random();

            var ws = new PresenterManager();
            var kinect = new KinectManager();
            using (var stats = new StatsServerManager(console.Server))
            {
                var heuristicsGueastures = new HeuristicsGuesturesEmitter(kinect.BodyReady);
                heuristicsGueastures.GestureDetected.Subscribe(ws.Send);
                heuristicsGueastures.GesturePointChanged.Subscribe(ws.Send);

                //var vgbGestures = new VgbGesturesEmiter(kinect.KinectChanged, kinect.BodyReady);
                //vgbGestures.GestureDetected.Subscribe(ws.Send);

                //var starGestures = new StarGestureEmitter(kinect.BodyReady);
                //starGestures.GestureDetected.Subscribe(ws.Send);
                //starGestures.GestureDetected.Subscribe(Console.WriteLine);

                var likeGestures = new LikeGestureEmitter(kinect.BodyReady);
                likeGestures.GestureDetected.Subscribe(ws.Send);
                likeGestures.GestureDetected.Subscribe(Console.WriteLine);

                var position = new PositionAndSkeletonEmitter(kinect.BodiesReady);
                position.PositionChanged.Subscribe(ws.Send);
                position.SkeletonChanged.Subscribe(ws.Send);

                var interaction = new InteractionStreamEmitter(kinect.BodyReady);
                interaction.InteractionChanged.Subscribe(ws.Send);

                var singlePersonTracking = new SinglePersonTracking(kinect.KinectChanged, kinect.BodiesReady);
                singlePersonTracking.TrackingChanged.Subscribe(ws.Send);
                singlePersonTracking.TrackingChanged.Subscribe(Console.WriteLine);
                
                stats.EventReceived
                    .OfType<ProjectLikeCountChanged>()
                    .Subscribe(ws.Send);

                ws.CommandRecieved.Subscribe(c =>
                {
                    if (c is RaiseProjectLike)
                    {
                        Console.WriteLine(c);
                        var raiseCmd = (RaiseProjectLike)c;
                        var registerCmd = new RecordProjectLike
                        {
                            ClientId = console.ClientId,
                            ProjectId = raiseCmd.ProjectId,
                            Timestamp = DateTime.Now
                        };
                        stats.Send(registerCmd);
                    }
                    else
                    {
                        stats.Send(c);
                    }
                });

                stats.Start();
                kinect.Start();

                while (!console.IsCancelRequested)
                {
                    Thread.Sleep(TimeSpan.FromSeconds(5));
                }

                // Close
                kinect.Stop();
            }
            
        }


    }
}

namespace Eleks.KinectBehance.KinectGlue
{
    using NetMQ;
    using NetMQ.Sockets;
    using System;
    using System.Reactive.Subjects;
    using System.Threading;
    using System.Threading.Tasks;
    using Utils.Protocol;
    using Eleks.KinectBehance.Contracts;

    public class StatsServerManager : IDisposable
    {
        NetMQContext context;
        SubscriberSocket subscriber;
        readonly CancellationTokenSource tokenSource = new CancellationTokenSource();
        PushSocket sender;
        readonly string server;
        readonly Subject<object> eventReceivedSubject = new Subject<object>();

        public StatsServerManager(string server)
        {
            this.server = server;
        }

        public IObservable<object> EventReceived
        {
            get { return eventReceivedSubject; }
        }

        private bool ServerSpecified
        {
            get { return !String.IsNullOrWhiteSpace(server); }
        }

        public void Start()
        {
            if (!ServerSpecified)
            {
                return;
            }
            if (context == null)
            {
                context = NetMQContext.Create();

                subscriber = context.CreateSubscriberSocket();
                subscriber.Connect("tcp://127.0.0.1:5252");
                subscriber.Subscribe(String.Empty);

                sender = context.CreatePushSocket();
                sender.Connect("tcp://127.0.0.1:5253");

                // Start listening..
                Task.Run(() =>
                {
                    while (!tokenSource.IsCancellationRequested)
                    {
                        var message = subscriber.ReceiveString();
                        var eventObject = Serialization.DeserializeEnvelope<ContractMarker>(message);
                        eventReceivedSubject.OnNext(eventObject);
                    }
                });
             }
        }

        public void Send(object content)
        {
            if (!ServerSpecified)
            {
                return;
            }
            Console.WriteLine("Stats send: " + content.GetType().Name + " > " + content);
            var payload = Serialization.SerializeWithEnvelope(content);
            sender.Send(payload);
        }

        void IDisposable.Dispose()
        {
            tokenSource.Cancel();
            if (subscriber != null)
            {
                subscriber.Unsubscribe(String.Empty);
                subscriber.Dispose();
            }
            if (sender != null)
            {
                sender.Dispose();
            }
            if (context != null)
            {
                context.Dispose();
            }
        }
    }
}

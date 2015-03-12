namespace Eleks.KinectBehance.StatsServer
{
    using NetMQ;
    using NetMQ.Sockets;
    using System;
    using System.Reactive.Subjects;
    using System.Threading;
    using System.Threading.Tasks;
    using Utils;
    using Utils.Protocol;
    using Contracts;

    public class ServerManager : IDisposable
    {
        NetMQContext context;
        readonly CancellationTokenSource tokenSource = new CancellationTokenSource();
        PullSocket receiver;
        PublisherSocket publisher;
        readonly Subject<object> commandReceivedSubject = new Subject<object>();

        public IObservable<object> CommandReceived
        {
            get { return commandReceivedSubject; }
        }

        public void Start()
        {
            if (context == null)
            {
                context = NetMQContext.Create();

                publisher = context.CreatePublisherSocket();
                publisher.Bind("tcp://*:5252");

                receiver = context.CreatePullSocket();
                receiver.Bind("tcp://*:5253");

                // Start listening..
                Task.Run(() =>
                {
                    try
                    {
                        while (!tokenSource.IsCancellationRequested)
                        {
                            var message = receiver.ReceiveString();
                            var command = Serialization.DeserializeEnvelope<ContractMarker>(message);
                            commandReceivedSubject.OnNext(command);
                        }
                    }
                    catch(Exception ex)
                    {
                        Tracer.Error(ex);
                        throw;
                    }
                    
                });
             }
        }

        public void Send(object content)
        {
            Console.WriteLine("Send: " + content.GetType().Name + " > " + content);
            SendInternal(Serialization.SerializeWithEnvelope(content));
        }

        void SendInternal(string message)
        {
            publisher.Send(message);
        }

        void IDisposable.Dispose()
        {
            tokenSource.Cancel();
            if (publisher != null)
            {
                publisher.Dispose();
            }
            if (receiver != null)
            {
                receiver.Dispose();
            }
            if (context != null)
            {
                context.Dispose();
            }
        }
    }
}

namespace Eleks.KinectBehance.KinectGlue
{
    using System.Collections.Generic;
    using Fleck;
    using System;
    using Utils.Protocol;
    using System.Reactive.Subjects;
    using Eleks.KinectBehance.Contracts;
    using Eleks.KinectBehance.Utils;

    public class PresenterManager
    {
        readonly List<IWebSocketConnection> clients = new List<IWebSocketConnection>();
        readonly Subject<object> commandReceivedSubject = new Subject<object>();

        public PresenterManager()
        {
            Initialize();
        }

        private void Initialize()
        {
            var server = new WebSocketServer("ws://0.0.0.0:8282");

            server.Start(socket =>
            {
                socket.OnOpen = () =>
                {
                    clients.Add(socket);
                };

                socket.OnClose = () =>
                {
                    clients.Remove(socket);
                };

                socket.OnMessage = message =>
                {
                    var eventObject = Serialization.DeserializeEnvelope<ContractMarker>(message);
                    commandReceivedSubject.OnNext(eventObject);
                };

                socket.OnBinary = data =>
                {
                    Tracer.Trace("Binary data sent from client o_0");
                };
            });
        }

        public IObservable<object> CommandRecieved
        {
            get { return commandReceivedSubject; }
        }

        private void SendInternal(string message)
        {
            foreach (var client in clients)
            {
                client.Send(message);
            }
        }

        public void Send(object content)
        {
            //Console.WriteLine("Send: " + content.GetType().Name + " > " + content);
            var payload = Serialization.SerializeWithEnvelope(content);
            SendInternal(payload);
        }
    }
}

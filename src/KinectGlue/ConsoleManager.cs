namespace Eleks.KinectBehance.KinectGlue
{
    using System;
    using Mono.Options;

    public class ConsoleManager
    {
        string server;
        bool cancelRequested;
        string clientId;

        public ConsoleManager(string[] args)
        {
            var p = new OptionSet() {
                { "s|server=", "Server address", v => server = v },
                { "i|id=", "This client ID", v => clientId = v }
            };

            try
            {
                p.Parse(args);
            }
            catch (OptionException e)
            {
                Console.WriteLine(e.Message);
            }

            Console.CancelKeyPress += (o, e) =>
            {
                e.Cancel = false;
                cancelRequested = true;
            };
        }

        public string Server { get { return server; } }
        public string ClientId { get { return clientId; } }
        public bool IsCancelRequested { get { return cancelRequested; } }

    }
}

namespace Eleks.KinectBehance.StatsServer
{
    using System;
    
    public class ConsoleManager
    {
        bool cancelRequested;
        
        public ConsoleManager(string[] args)
        {
            Console.CancelKeyPress += (o, e) =>
            {
                e.Cancel = false;
                cancelRequested = true;
            };
        }

        public bool IsCancelRequested { get { return cancelRequested; } }

    }
}

namespace Eleks.KinectBehance.Utils
{
    using System;

    public static class Tracer
    {
        public static void Error(Exception ex)
        {
            Console.ForegroundColor = ConsoleColor.Red;
            Console.WriteLine(ex);
            Console.ResetColor();
        }

        public static void Trace(string message)
        {
            Console.WriteLine(message);
        }
    }
}

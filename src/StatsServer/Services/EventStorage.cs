namespace Eleks.KinectBehance.StatsServer.Services
{
    using Dapper;
    using Infrastructure;
    using Newtonsoft.Json;
    using System;

    public static class AuditStorage
    {
        private static void Ensure()
        {
            Db.Run(c =>
            {
                c.Execute(@"create table if not exists [Audit]([Type] text, [Timestamp] text, [Content] text);", new { });
            });
        }

        public static void Store(object content)
        {
            Ensure();

            var type = content.GetType().Name;
            var payload = JsonConvert.SerializeObject(content);

            Db.Run(c =>
            {
                c.Execute(@"insert into Audit values (@Type, @Timestamp, @Content)",
                          new { Type = type, Timestamp = DateTimeOffset.UtcNow, Content = payload });
            });
        }
    }
}

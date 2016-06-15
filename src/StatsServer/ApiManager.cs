using Eleks.KinectBehance.StatsServer.Services;
using Nancy;
using Nancy.Hosting.Self;
using System;
using System.Linq;
using Nancy.Bootstrapper;
using Nancy.TinyIoc;

namespace Eleks.KinectBehance.StatsServer
{
    public class ApiManager : IDisposable
    {
        readonly NancyHost _host = new NancyHost(new ApiBootstrapper(), new Uri("http://localhost:8380"));

        public ApiManager()
        {            
            _host.Start();
        }

        public class ApiBootstrapper : DefaultNancyBootstrapper
        {
            protected override void ApplicationStartup(TinyIoCContainer container, IPipelines pipelines)
            {
                base.ApplicationStartup(container, pipelines);

                pipelines.AfterRequest.AddItemToEndOfPipeline(ctx =>
                {
                    if (ctx.Request.Headers.Keys.Contains("Origin"))
                    {
                        var origins = "" + string.Join(" ", ctx.Request.Headers["Origin"]);
                        ctx.Response.Headers["Access-Control-Allow-Origin"] = origins;

                        if (ctx.Request.Method == "OPTIONS")
                        {
                            // handle CORS preflight request
                            ctx.Response.Headers["Access-Control-Allow-Methods"] =
                                "GET, POST, PUT, DELETE, OPTIONS";

                            if (ctx.Request.Headers.Keys.Contains("Access-Control-Request-Headers"))
                            {
                                var allowedHeaders = "" + string.Join(
                                    ", ", ctx.Request.Headers["Access-Control-Request-Headers"]);
                                ctx.Response.Headers["Access-Control-Allow-Headers"] = allowedHeaders;
                            }
                        }
                    }
                });
            }
        }

        public class ApiModule : NancyModule
        {
            public ApiModule() : base("/api")
            {
                Get["/stats"] = req => ProjectLikesStorage.AllLikes();
            }
        }

        public void Dispose()
        {
            _host.Dispose();
        }
    }
}

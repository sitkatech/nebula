﻿using System;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Net.Http;
using System.Threading;
using IdentityServer4.AccessTokenValidation;
using Microsoft.ApplicationInsights;
using Microsoft.ApplicationInsights.DependencyCollector;
using Microsoft.ApplicationInsights.Extensibility;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;
using Serilog;
using Nebula.API.Services;
using Nebula.API.Services.Telemetry;
using Nebula.EFModels.Entities;
using Serilog.Sinks.ApplicationInsights.TelemetryConverters;
using ILogger = Serilog.ILogger;

namespace Nebula.API
{
    public class Startup
    {
        private readonly TelemetryClient _telemetryClient;
        private readonly IWebHostEnvironment _environment;
        private string _instrumentationKey;

        public Startup(IWebHostEnvironment environment, IConfiguration configuration)
        {
            Configuration = configuration;
            _environment = environment;

            _instrumentationKey = Configuration["APPINSIGHTS_INSTRUMENTATIONKEY"];

            if (!string.IsNullOrWhiteSpace(_instrumentationKey))
            {
                _telemetryClient = new TelemetryClient(TelemetryConfiguration.CreateDefault())
                {
                    InstrumentationKey = _instrumentationKey
                };
            }
            else
            {
                _telemetryClient = new TelemetryClient(TelemetryConfiguration.CreateDefault());
            }
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddApplicationInsightsTelemetry(_instrumentationKey);
            services.AddControllers().AddNewtonsoftJson(opt =>
            {
                if (!_environment.IsProduction())
                {
                    opt.SerializerSettings.Formatting = Formatting.Indented;
                }

                opt.SerializerSettings.DateTimeZoneHandling = DateTimeZoneHandling.Utc;
                var resolver = opt.SerializerSettings.ContractResolver;
                if (resolver != null)
                {
                    if (resolver is DefaultContractResolver defaultResolver)
                    {
                        defaultResolver.NamingStrategy = null;
                    }
                }
            });

            services.Configure<NebulaConfiguration>(Configuration);

            var nebulaConfiguration = Configuration.Get<NebulaConfiguration>();
            var keystoneHost = nebulaConfiguration.KEYSTONE_HOST;
            services.AddAuthentication(IdentityServerAuthenticationDefaults.AuthenticationScheme)
                .AddJwtBearer(options =>
                {
                    if (_environment.IsDevelopment())
                    {
                        // NOTE: CG 3/22 - This allows the self-signed cert on Keystone to work locally.
                        options.BackchannelHttpHandler = new HttpClientHandler()
                        {
                            ServerCertificateCustomValidationCallback = (message, certificate2, arg3, arg4) => true
                        };
                        //These allow the use of the container name and the url when developing.
                        options.TokenValidationParameters.ValidateIssuer = false;
                    }
                    options.TokenValidationParameters.ValidateAudience = false;
                    options.Authority = keystoneHost;
                    options.RequireHttpsMetadata = false;
                    options.SecurityTokenValidators.Clear();
                    options.SecurityTokenValidators.Add(new JwtSecurityTokenHandler
                    {
                        MapInboundClaims = false
                    });
                    options.TokenValidationParameters.NameClaimType = "name";
                    options.TokenValidationParameters.RoleClaimType = "role";
                });

            services.AddDbContext<NebulaDbContext>(c =>
            {
                c.UseSqlServer(nebulaConfiguration.DB_CONNECTION_STRING, x =>
                {
                    x.CommandTimeout((int)TimeSpan.FromMinutes(3).TotalSeconds);
                    x.UseNetTopologySuite();
                });
            });

            services.AddSingleton(Configuration);
            services.AddSingleton<ITelemetryInitializer, CloudRoleNameTelemetryInitializer>();
            services.AddSingleton<ITelemetryInitializer, UserInfoTelemetryInitializer>();
            services.AddSingleton<IHttpContextAccessor, HttpContextAccessor>();
            var logger = GetSerilogLogger();
            services.AddSingleton(logger);

            services.AddTransient(s => new KeystoneService(s.GetService<IHttpContextAccessor>(), keystoneHost));
            services.AddSingleton(x => new SitkaSmtpClientService(nebulaConfiguration));

            services.AddScoped(s => s.GetService<IHttpContextAccessor>().HttpContext);
            services.AddScoped(s => UserContext.GetUserFromHttpContext(s.GetService<NebulaDbContext>(),
                s.GetService<IHttpContextAccessor>().HttpContext));
            services.AddControllers();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env,
            IHostApplicationLifetime applicationLifetime, ILoggerFactory loggerFactory, ILogger logger)
        {
            loggerFactory.AddSerilog(logger);
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseExceptionHandler("/Home/Error");
                // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
                app.UseHsts();
            }

            app.UseHttpsRedirection();
            app.UseRouting();
            app.UseCors(policy =>
            {
                //TODO: don't allow all origins
                policy.AllowAnyOrigin();
                policy.AllowAnyHeader();
                policy.AllowAnyMethod();
                policy.WithExposedHeaders("WWW-Authenticate");
            });

            app.UseAuthentication();
            app.UseAuthorization();

            app.Use(TelemetryHelper.PostBodyTelemetryMiddleware);

            app.UseEndpoints(endpoints => { endpoints.MapControllers(); });

            applicationLifetime.ApplicationStopping.Register(OnShutdown);

            var modules = app.ApplicationServices.GetServices<ITelemetryModule>();
            var dependencyModule = modules.OfType<DependencyTrackingTelemetryModule>().FirstOrDefault();

            if (dependencyModule != null)
            {
                var domains = dependencyModule.ExcludeComponentCorrelationHttpHeadersOnDomains;
                domains.Add("core.windows.net");
                domains.Add("10.0.75.1");
            }
        }

        private void OnShutdown()
        {
            _telemetryClient.Flush();
            Thread.Sleep(1000);
        }

        private ILogger GetSerilogLogger()
        {
            var outputTemplate =
                $"[{_environment.EnvironmentName}] {{Timestamp:yyyy-MM-dd HH:mm:ss zzz}} {{Level}} | {{RequestId}}-{{SourceContext}}: {{Message}}{{NewLine}}{{Exception}}";
            var serilogLogger = new LoggerConfiguration()
                .ReadFrom.Configuration(Configuration)
                .WriteTo.Console(outputTemplate: outputTemplate);

            if (!_environment.IsDevelopment())
            {
                serilogLogger.WriteTo.ApplicationInsights(_telemetryClient, new TraceTelemetryConverter());
            }

            return serilogLogger.CreateLogger();
        }
    }
}
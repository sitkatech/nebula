using IdentityServer4.AccessTokenValidation;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Nebula.API.Converters;
using Nebula.API.Logging;
using Nebula.API.Services;
using Nebula.EFModels.Entities;
using NetTopologySuite.IO.Converters;
using SendGrid.Extensions.DependencyInjection;
using Serilog;
using System;
using System.IdentityModel.Tokens.Jwt;
using System.Net.Http;
using System.Text.Json.Serialization;
using ILogger = Serilog.ILogger;

namespace Nebula.API
{
    public class Startup
    {
        private readonly IWebHostEnvironment _environment;

        public Startup(IWebHostEnvironment environment, IConfiguration configuration)
        {
            Configuration = configuration;
            _environment = environment;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddControllers().AddJsonOptions(opt =>
            {
                opt.JsonSerializerOptions.Converters.Add(new GeoJsonConverterFactory());
                opt.JsonSerializerOptions.Converters.Add(new DateTimeConverter());
                opt.JsonSerializerOptions.Converters.Add(new BooleanConverter());
                opt.JsonSerializerOptions.Converters.Add(new DoubleConverter(2));
                opt.JsonSerializerOptions.Converters.Add(new IntConverter());
                opt.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
                opt.JsonSerializerOptions.Converters.Add(new NullableConverterFactory());
                opt.JsonSerializerOptions.PropertyNameCaseInsensitive = false;
                opt.JsonSerializerOptions.PropertyNamingPolicy = null;
                opt.JsonSerializerOptions.NumberHandling = JsonNumberHandling.AllowNamedFloatingPointLiterals;
                opt.JsonSerializerOptions.WriteIndented = true;
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
            services.AddSingleton<IHttpContextAccessor, HttpContextAccessor>();

            services.AddTransient(s => new KeystoneService(s.GetService<IHttpContextAccessor>(), keystoneHost));

            services.AddSendGrid(options => { options.ApiKey = nebulaConfiguration.SendGridApiKey; });
            services.AddSingleton<SitkaSmtpClientService>();

            services.AddScoped(s => s.GetService<IHttpContextAccessor>().HttpContext);
            services.AddScoped(s => UserContext.GetUserFromHttpContext(s.GetService<NebulaDbContext>(),
                s.GetService<IHttpContextAccessor>().HttpContext));
            services.AddControllers();

            #region Swagger
            // Base swagger services
            services.AddSwaggerGen(options =>
            {
            });
            #endregion

            services.AddHealthChecks().AddDbContextCheck<NebulaDbContext>();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env,
             ILoggerFactory loggerFactory, ILogger logger)
        {
            app.UseSerilogRequestLogging(opts =>
            {
                opts.EnrichDiagnosticContext = LogHelper.EnrichFromRequest;
                opts.GetLevel = LogHelper.CustomGetLevel;
            });
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
            app.UseMiddleware<LogHelper>();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
                endpoints.MapHealthChecks("/healthz");
            });
            
        }
       
    }
}

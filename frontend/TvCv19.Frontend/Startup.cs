using System;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using TvCv19.DailyCo.Client;
using TvCv19.Frontend.Domain;
using TvCv19.Frontend.Domain.Identity;
using TvCv19.Frontend.Domain.Models;
using TvCv19.Frontend.Domain.Repositories;
using TvCv19.Frontend.Hubs;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using System.Security.Claims;
using System.IdentityModel.Tokens.Jwt;
using TvCv19.Frontend.Controllers;
using TvCv19.Frontend.Domain.Services;

namespace TvCv19.Frontend
{
    public class Startup
    {
        private const string DAILY_TOKEN = "Ee910bcf0c64a3fac675bf9b04e89780a9972ba61078f188a0314b6805532ae5";
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddScoped<IPatientRepository, PatientRepository>();
            services.AddScoped<IPhysicianRepository, PhyscianRepository>();
            services.AddScoped<IMessageRepository, MessageRepository>();
            services.AddScoped<IMediaRepository, MediaRepository>();
            services.AddScoped<INotificationRepository, NotificationRepository>();
            services.AddScoped<IUserRepository, UserRepository>();
            services.AddScoped<IRegistrationService, RegistrationService>();
            services.AddScoped<IJwtGenerator, JwtGenerator>();
            services.AddControllersWithViews().AddNewtonsoftJson();
            services.AddSignalR();
            services.AddHttpClient<RoomClient>(c => c.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", DAILY_TOKEN));
            services.Configure<JwtConfig>(Configuration.GetSection("JwtConfig"));
         

            // identity backend stores
            services.AddTransient<IUserStore<User>, UserStore>();
            services.AddTransient<IRoleStore<Role>, RoleStore>();
           

            services.AddIdentity<User, Role>(options =>
            {
                // Password settings.
                options.Password.RequireDigit = false;
                options.Password.RequireLowercase = true;
                options.Password.RequireNonAlphanumeric = false;
                options.Password.RequireUppercase = false;
                options.Password.RequiredLength = 6;
                options.Password.RequiredUniqueChars = 1;

                // Lockout settings.
                options.Lockout.DefaultLockoutTimeSpan = TimeSpan.FromMinutes(5);
                options.Lockout.MaxFailedAccessAttempts = 5;
                options.Lockout.AllowedForNewUsers = true;

                // User settings.
                options.User.AllowedUserNameCharacters =
                "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-._@+";
                options.User.RequireUniqueEmail = false;
            })
                .AddDefaultTokenProviders();

            services
                .AddAuthentication(options =>
                {
                    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                    options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
                    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;

                })
                .AddJwtBearer(cfg =>
                {
#if DEBUG
                    cfg.RequireHttpsMetadata = false;
#endif
                    cfg.SaveToken = true;
                    cfg.TokenValidationParameters = new TokenValidationParameters
                    {

                        ValidIssuer = Configuration["JwtConfig:JwtIssuer"],
                        ValidAudience = Configuration["JwtConfig:JwtIssuer"],
                        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(Configuration["JwtConfig:JwtKey"])),
                        ClockSkew = TimeSpan.Zero // remove delay of token when expire
                    };

                    //signalr auth 
                    cfg.Events = new JwtBearerEvents
                    {
                        OnMessageReceived = context =>
                        {
                            var accessToken = context.Request.Query["access_token"];
        
                            // If the request is for our hub...
                            var path = context.HttpContext.Request.Path;
                            if (!string.IsNullOrEmpty(accessToken) &&
                                (path.StartsWithSegments("/hubs/chat")))
                            {
                                // Read the token out of the query string
                                context.Token = accessToken;
                            }
                            return Task.CompletedTask;
                        }
                    };
                });


            // In production, the Angular files will be served from this directory
            services.AddSpaStaticFiles(configuration =>
            {
                configuration.RootPath = "ClientApp/dist";
            });
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env, UserManager<User> userManager)
        {
            EnsureDefaultUser(userManager).Wait();

            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseExceptionHandler("/Error");
            }

            app.UseStaticFiles();
            if (!env.IsDevelopment())
            {
                app.UseSpaStaticFiles();
            }

            app.UseRouting();

            app.UseAuthentication();
            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllerRoute(
                    name: "default",
                    pattern: "{controller}/{action=Index}/{id?}");

                endpoints.MapHub<ChatHub>("/hubs/chat");
            });

            app.UseSpa(spa =>
            {
                // To learn more about options for serving an Angular SPA from ASP.NET Core,
                // see https://go.microsoft.com/fwlink/?linkid=864501

                spa.Options.SourcePath = "ClientApp";

                if (env.IsDevelopment())
                {
                    //spa.UseAngularCliServer(npmScript: "start");
                    spa.UseProxyToSpaDevelopmentServer("http://localhost:4200");
                }
            });
        }

        private async Task EnsureDefaultUser(UserManager<User> userManager)
        {
            if (await userManager.FindByNameAsync("administrator") == null)
            {
                var id = Guid.NewGuid().ToString("N");
                await userManager.CreateAsync(new User
                {
                    Id = id,
                    UserName = "administrator"
                }, "Password1!"); ;
                var user = await userManager.FindByNameAsync("administrator");
                await userManager.AddClaimsAsync(user,new [] { new Claim(ClaimTypes.Role, "Administrator"),
                                                               new Claim(JwtRegisteredClaimNames.Sub, id),
                                                               new Claim("name", "Admin"),
                                                               });
            }
        }
    }

    public class JwtConfig
    {
        public string AllowedHosts { get; set; }
        public string JwtKey { get; set; }
        public string JwtIssuer { get; set; }
        public string JwtExpireDays { get; set; }
    }
}

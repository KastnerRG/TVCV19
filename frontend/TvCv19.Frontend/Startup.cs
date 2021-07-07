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
using System.Linq;
using Microsoft.EntityFrameworkCore;

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
            services.AddScoped<IApplicationLoginRepository, ApplicationLoginRepository>();
            services.AddScoped<IApplicationRoleRepository, ApplicationRoleRepository>();
            services.AddControllersWithViews().AddNewtonsoftJson();
            services.AddSignalR();
            services.AddHttpClient<RoomClient>(c => c.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", DAILY_TOKEN));
            services.AddTransient<IUserStore<ApplicationLogin>, UserStore>();
            services.AddTransient<IRoleStore<ApplicationRole>, RoleStore>();

            services.AddIdentity<ApplicationLogin, ApplicationRole>()
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
                        ValidIssuer = Configuration["JwtIssuer"],
                        ValidAudience = Configuration["JwtIssuer"],
                        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(Configuration["JwtKey"])),
                        ClockSkew = TimeSpan.Zero // remove delay of token when expire
                    };
                });

            services.Configure<IdentityOptions>(options =>
            {
                // Password settings.
                options.Password.RequireDigit = true;
                options.Password.RequireLowercase = true;
                options.Password.RequireNonAlphanumeric = true;
                options.Password.RequireUppercase = true;
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
            });

            // In production, the Angular files will be served from this directory
            services.AddSpaStaticFiles(configuration =>
            {
                configuration.RootPath = "ClientApp/dist";
            });
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public async void Configure(IApplicationBuilder app, IWebHostEnvironment env, RoleManager<ApplicationRole> roleManager, UserManager<ApplicationLogin> userManager)
        {
            using var context = new MedeccContext();
            await context.Database.MigrateAsync();

            await EnsureDefaultRolesAsync(roleManager);
            await EnsureDefaultUserAsync(userManager);

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
                endpoints.MapHub<DeviceAuthorizationHub>("/hubs/device-authorization");
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

        private async Task EnsureDefaultUserAsync(UserManager<ApplicationLogin> userManager)
        {
            if (await userManager.FindByNameAsync("administrator") == null)
            {
                await userManager.CreateAsync(new ApplicationLogin
                {
                    UserName = "administrator"
                }, "Password1!"); // This is the simpliest password that meets the requirements.
            }

            var administrator = await userManager.FindByNameAsync("administrator");
            await userManager.AddToRoleAsync(administrator, "Administrator");
            await userManager.AddToRoleAsync(administrator, "Physician");
            await userManager.AddToRoleAsync(administrator, "Patient");
        }

        private Task EnsureDefaultRolesAsync(RoleManager<ApplicationRole> roleManager)
        {
            return Task.WhenAll(
                EnsureRoleExistsAsync("User", roleManager),
                EnsureRoleExistsAsync("Administrator", roleManager),
                EnsureRoleExistsAsync("Patient", roleManager),
                EnsureRoleExistsAsync("Physician", roleManager));
        }

        private async Task EnsureRoleExistsAsync(string roleName, RoleManager<ApplicationRole> roleManager)
        {
            if (await roleManager.FindByNameAsync(roleName) == null)
            {
                await roleManager.CreateAsync(new ApplicationRole
                {
                    Name = roleName
                });
            }
        }
    }
}

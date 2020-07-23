using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Configuration;
using TvCv19.Frontend.Domain.Models;
using TvCv19.Frontend.Hubs;

namespace TvCv19.Frontend.Controllers
{
    [ApiController]
    public class DeviceController : ControllerBase
    {
        public class EndRegisterPatientDeviceModel
        {
            public string ConnectionId { get; set; }
        }

        private const string AllowableCharacters = "abcdefghijklmnopqrstuvwxyz0123456789";

        private readonly IConfiguration configuration;
        private readonly IHubContext<DeviceAuthorizationHub> deviceAuthorizationHubContext;
        private readonly UserManager<ApplicationLogin> userManager;

        public DeviceController(IConfiguration configuration, IHubContext<DeviceAuthorizationHub> deviceAuthorizationHubContext, UserManager<ApplicationLogin> userManager)
        {
            this.configuration = configuration;
            this.deviceAuthorizationHubContext = deviceAuthorizationHubContext;
            this.userManager = userManager;
        }

        [Route("api/device/patient")]
        [HttpPost]
        public async Task<IActionResult> BeginRegisterPatientDeviceAsync()
        {
            string token = GenerateString(36);

            await userManager.CreateAsync(new ApplicationLogin
            {
                UserName = token
            });

            return Ok(token);
        }

        [Authorize]
        [Route("api/device/patient/{token}")]
        [HttpPut]
        public async Task<IActionResult> EndRegisterPatientDeviceAsync(string token, [FromBody]EndRegisterPatientDeviceModel model)
        {
            var applicationLogin = await userManager.FindByNameAsync(token);
            var jwtToken = applicationLogin.GenerateJwtToken(configuration);

            await deviceAuthorizationHubContext.Clients.Clients(model.ConnectionId).SendAsync("LoginPatientDevice", jwtToken);

            return Ok();
        }

        public static string GenerateString(int length)
        {
            var bytes = new byte[length];

            using (var random = RandomNumberGenerator.Create())
            {
                random.GetBytes(bytes);
            }

            return new string(bytes.Select(x => AllowableCharacters[x % AllowableCharacters.Length]).ToArray());
        }
    }
}

using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using TvCv19.Frontend.Domain.Models;
using TvCv19.Frontend.Domain.Repositories;

namespace TvCv19.Frontend.Controllers
{
    [Authorize(Roles = "administrator")]
    [Route("api/application-login")]
    [ApiController]
    public class ApplicationLoginController : ControllerBase
    {
        public class CreateApplicationLoginModel
        {
            public ApplicationLogin ApplicationLogin { get; set; }
            public string Password { get; set; }
        }

        public class SetPasswordModel
        {
            public string Password { get; set; }
        }

        private readonly UserManager<ApplicationLogin> userManager;
        private readonly IApplicationLoginRepository applicationLoginRepository;

        public ApplicationLoginController(UserManager<ApplicationLogin> userManager, IApplicationLoginRepository applicationLoginRepository)
        {
            this.userManager = userManager;
            this.applicationLoginRepository = applicationLoginRepository;
        }

        [HttpPost]
        public async Task<IActionResult> CreateApplicationLoginAsync([FromBody] CreateApplicationLoginModel model)
        {
            var result = await userManager.CreateAsync(model.ApplicationLogin, model.Password);
            
            if (result.Succeeded)
            {
                var createdUserName = await userManager.FindByNameAsync(model.ApplicationLogin.UserName);
                await userManager.AddToRoleAsync(createdUserName, "Physician");

                return Ok(createdUserName);
            }

            return BadRequest();
        }

        [HttpGet]
        public async Task<IActionResult> GetApplicationLoginsAsync() =>
            Ok(from appLogin in await this.applicationLoginRepository.GetApplicationLoginsAsync()
               select appLogin.StripPassword());

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateApplicationLoginAsync(int id, [FromBody]ApplicationLogin applicationLogin)
        {
            var fromDatabase = await userManager.FindByIdAsync(id.ToString());

            if (fromDatabase == null)
            {
                return NotFound();
            }

            var applicationLoginToUpdate = new ApplicationLogin
            {
                Id = id,
                Enabled = applicationLogin.Enabled ?? fromDatabase.Enabled.Value,
                NormalizedUserName = applicationLogin.NormalizedUserName ?? fromDatabase.NormalizedUserName,
                UserName = applicationLogin.UserName ?? fromDatabase.UserName,
                PasswordHash = fromDatabase.PasswordHash
            };

            var result = await userManager.UpdateAsync(applicationLoginToUpdate);

            if (result.Errors.Any())
            {
                return BadRequest(result);
            }

            return Ok(result);
        }

        [HttpPut("{id}/password")]
        public async Task<IActionResult> SetPasswordAsync(string id, [FromBody]SetPasswordModel model)
        {
            var fromDatabase = await userManager.FindByIdAsync(id);

            if (fromDatabase == null)
            {
                return NotFound();
            }

            await userManager.RemovePasswordAsync(fromDatabase);

            return Ok(await userManager.AddPasswordAsync(fromDatabase, model.Password));
        }

    }
}

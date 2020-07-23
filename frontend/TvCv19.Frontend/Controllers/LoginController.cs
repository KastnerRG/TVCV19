using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Reflection.Metadata.Ecma335;
using System.Security.Claims;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using TvCv19.Frontend.Domain.Identity;
using TvCv19.Frontend.Domain.Models;
using TvCv19.Frontend.Domain.Repositories;

namespace TvCv19.Frontend.Controllers
{
    [ApiController]
    public class LoginController : ControllerBase
    {
        private readonly IConfiguration configuration;
        private readonly SignInManager<ApplicationLogin> signInManager;
        private readonly UserManager<ApplicationLogin> userManager;

        public LoginController(IConfiguration configuration, SignInManager<ApplicationLogin> signInManager, UserManager<ApplicationLogin> userManager)
        {
            this.configuration = configuration;
            this.signInManager = signInManager;
            this.userManager = userManager;
        }

        [Route("api/login")]
        [HttpGet]
        public bool CheckLoggedIn() =>
            User.Identity.IsAuthenticated;

        [Route("api/login")]
        [HttpPost]
        public async Task<IActionResult> LoginAsync(LoginModel loginModel)
        {
            var applicationLogin = await userManager.FindByNameAsync(loginModel.UserName);
            var result = await signInManager.CheckPasswordSignInAsync(applicationLogin, loginModel.Password, true);
            
            if (result.Succeeded)
            {
                Request.ContentType = "text/plain";

                // Return a Jwt Token.
                return Ok(applicationLogin.GenerateJwtToken(configuration));
            }

            return Unauthorized();
        }
    }

    public class LoginModel
    {
        public string UserName { get; set; }
        public string Password { get; set; }
    }
}

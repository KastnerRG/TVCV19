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
using SignInResult = Microsoft.AspNetCore.Identity.SignInResult;

namespace TvCv19.Frontend.Controllers
{
    [ApiController]
    public class LoginController : ControllerBase
    {
        private readonly IConfiguration configuration;
        private readonly SignInManager<ApplicationLogin> signInManager;
        private readonly IUserStore<ApplicationLogin> userStore;

        public LoginController(IConfiguration configuration, SignInManager<ApplicationLogin> signInManager, IUserStore<ApplicationLogin> userStore)
        {
            this.configuration = configuration;
            this.signInManager = signInManager;
            this.userStore = userStore;
        }

        [Route("api/login")]
        [HttpGet]
        public bool CheckLoggedIn() =>
            User.Identity.IsAuthenticated;

        [Route("api/login")]
        [HttpPost]
        public async Task<string> LoginAsync(LoginModel loginModel, CancellationToken cancellationToken)
        {
            var applicationLogin = await userStore.FindByNameAsync(loginModel.UserName.ToUpperInvariant(), cancellationToken);
            var result = await signInManager.CheckPasswordSignInAsync(applicationLogin, loginModel.Password, true);
            
            if (result.Succeeded)
            {
                Request.ContentType = "text/plain";

                // Return a Jwt Token.
                return GenerateJwtToken(applicationLogin.NormalizedUserName, applicationLogin);
            }

            throw new ApplicationException("INVALID_LOGIN_ATTEMPT");
        }

        private string GenerateJwtToken(string userName, ApplicationLogin user)
        {
            var claims = new List<Claim>
            {
                new Claim(JwtRegisteredClaimNames.Sub, userName),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                new Claim(ClaimTypes.NameIdentifier, user.Id)
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(configuration["JwtKey"]));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
            var expires = DateTime.Now.AddDays(Convert.ToDouble(configuration["JwtExpireDays"]));

            var token = new JwtSecurityToken(
                configuration["JwtIssuer"],
                configuration["JwtIssuer"],
                claims,
                expires: expires,
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }

    public class LoginModel
    {
        public string UserName { get; set; }
        public string Password { get; set; }
    }
}

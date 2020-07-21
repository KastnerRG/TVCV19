using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Reflection.Metadata.Ecma335;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using TvCv19.Frontend.Domain.Models;
using SignInResult = Microsoft.AspNetCore.Identity.SignInResult;

namespace TvCv19.Frontend.Controllers
{
    [ApiController]
    public class LoginController : ControllerBase
    {
        private readonly SignInManager<ApplicationLogin> signInManager;

        public LoginController(SignInManager<ApplicationLogin> signInManager)
        {
            this.signInManager = signInManager;
        }

        [Route("api/login")]
        [HttpGet]
        public bool CheckLoggedIn() =>
            User.Identity.IsAuthenticated;

        [Route("api/login")]
        [HttpPost]
        public Task<SignInResult> LoginAsync(LoginModel loginModel) =>
            signInManager.PasswordSignInAsync(loginModel.UserName, loginModel.Password, loginModel.RememberMe, true);

        [Route("api/logout")]
        [HttpPost]
        public IActionResult Logout()
        {
            Response.Cookies.Delete(".AspNetCore.Identity.Application");

            return Ok();
        }
    }

    public class LoginModel
    {
        public string UserName { get; set; }
        public string Password { get; set; }
        public bool RememberMe { get; set; }
    }
}

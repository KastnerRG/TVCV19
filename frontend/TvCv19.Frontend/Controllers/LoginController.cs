using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using TvCv19.Frontend.Domain.Models;
using TvCv19.Frontend.Domain.Services;

namespace TvCv19.Frontend.Controllers
{
    [ApiController]
    public class LoginController : ControllerBase
    {
        private readonly SignInManager<User> _signInManager;
        private readonly UserManager<User> _userManager;
        private readonly IJwtGenerator _jwtGenerator;

        private readonly JwtConfig _jwtConfig;

        public LoginController(SignInManager<User> signInManager, UserManager<User> userManager, IJwtGenerator jwtGenerator, IOptions<JwtConfig> options)
        {
            _signInManager = signInManager;
            _userManager = userManager;
            _jwtGenerator = jwtGenerator;
            _jwtConfig = options.Value;
        }

        [Route("api/login")]
        [HttpPost]
        public async Task<IActionResult> LoginAsync(LoginModel loginModel)
        {
            var user = await _userManager.FindByNameAsync(loginModel.UserName);
            var result = await _signInManager.CheckPasswordSignInAsync(user, loginModel.Password, true);
            
            if (result.Succeeded)
            {
                var claims = await _userManager.GetClaimsAsync(user);
                var expires = DateTime.Now.AddDays(Convert.ToDouble(_jwtConfig.JwtExpireDays));
                return Ok(new { Token = _jwtGenerator.GenerateToken(claims, expires), Expires =  expires});
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

using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using TvCv19.Frontend.Domain.Models;
using System.Security.Claims;

namespace TvCv19.Frontend.Domain.Services
{
    public class RegistrationService : IRegistrationService
    {
        private readonly UserManager<User> _userManager;

        public RegistrationService(UserManager<User> userManager)
        {
            _userManager = userManager;
        }

        public async Task<string> Register(string username, string password, UserType userType)
        {
            var id = Guid.NewGuid().ToString("N");
            var user = new User() { Id = id, UserName = username, UserType = userType, Enabled = true };
            var createResult = await _userManager.CreateAsync(user, password);
            if(!createResult.Succeeded) {
                return null;
            }

            var claims = CreateClaims(user.Id, userType, username);
            var claimsResult = await _userManager.AddClaimsAsync(user, claims);
            if(claimsResult.Succeeded) {
                return id;
            }
            return null;
        }

        private IEnumerable<Claim> CreateClaims(string id, UserType userType, string username)
        {

            var claims = new List<Claim>() { 
                new Claim(System.IdentityModel.Tokens.Jwt.JwtRegisteredClaimNames.Sub, id),
                new Claim("name", username) 
            };

            switch (userType)
            {
                case UserType.Patient:
                    claims.AddRange(new[] { new Claim(ClaimTypes.Role, "Patient") });
                    break;
                case UserType.Caregiver:
                    claims.AddRange(new[] { new Claim(ClaimTypes.Role, "Caregiver") });
                    break;
                case UserType.Administrator:
                    claims.AddRange(new[] { new Claim(ClaimTypes.Role, "Administrator") });
                    break;
            }

            return claims;
        }
    }
}

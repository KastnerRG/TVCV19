using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace TvCv19.Frontend.Domain.Models
{
    public class ApplicationLogin : IDbEntity
    {
        public string Id { get; set; }
        public bool? Enabled { get; set; }
        public string NormalizedUserName { get; set; }
        public string UserName { get; set; }
        public string PasswordHash { get; set; }

        public string GenerateJwtToken(IConfiguration configuration)
        {
            var claims = new List<Claim>
            {
                new Claim(JwtRegisteredClaimNames.Sub, UserName),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                new Claim(ClaimTypes.NameIdentifier, Id)
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

        public ApplicationLogin StripPassword() =>
            new ApplicationLogin
            {
                Id = Id,
                Enabled = Enabled,
                NormalizedUserName = NormalizedUserName,
                UserName = UserName
            };
    }
}

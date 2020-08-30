using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;

namespace TvCv19.Frontend.Domain.Services
{
    public class JwtGenerator : IJwtGenerator
    {
        private readonly JwtConfig _jwtConfig;

        public JwtGenerator(IOptions<JwtConfig> options)
        {
            _jwtConfig = options.Value;
        }

        public string GenerateToken(IEnumerable<Claim> claims, DateTime expires)
        {
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwtConfig.JwtKey));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                _jwtConfig.JwtIssuer,
                _jwtConfig.JwtIssuer,
                claims,
                expires: expires,
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}

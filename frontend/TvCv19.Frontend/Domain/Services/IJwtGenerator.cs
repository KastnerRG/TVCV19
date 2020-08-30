using System;
using System.Collections.Generic;
using System.Security.Claims;

namespace TvCv19.Frontend.Domain.Services
{
    public interface IJwtGenerator
    {
        string GenerateToken(IEnumerable<Claim> claims, DateTime expires);
    }
}
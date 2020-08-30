using System.Security.Claims;

namespace TvCv19.Frontend.Domain.Models
{
    public class UserClaim : IDbEntity
    {
        public string Id { get; set; }
        public string UserId { get; set; }
        public string ClaimType { get; set; }
        public string ClaimValue { get; set; }
    }
}
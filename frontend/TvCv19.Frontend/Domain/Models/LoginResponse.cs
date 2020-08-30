using System;
namespace TvCv19.Frontend.Domain.Models
{
    public class LoginResponse 
    {
        public int ExpiresAt { get; set; }
        public string Token { get; set; }
       
    }
    
}

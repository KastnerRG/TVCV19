using System.Threading.Tasks;
using TvCv19.Frontend.Domain.Models;

namespace TvCv19.Frontend.Domain.Services
{
    public interface IRegistrationService
    {
        Task<string> Register(string username, string password, UserType userType);
    }
}
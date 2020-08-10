using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using TvCv19.Frontend.Domain;
using TvCv19.Frontend.Domain.Models;
using TvCv19.Frontend.Domain.Repositories;

namespace TvCv19.Frontend.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/physician")]
    public class PhysicianController : Controller
    {
        private readonly ILogger<PhysicianController> _logger;
        private readonly UserManager<ApplicationLogin> _userManager;
        private readonly IPhysicianRepository _physicianRepository;

        public PhysicianController(IPhysicianRepository physicianRepository, UserManager<ApplicationLogin> userManager, ILogger<PhysicianController> logger)
        {
            _logger = logger;
            _userManager = userManager;
            _physicianRepository = physicianRepository;
        }

        [HttpPost]
        [Authorize(Roles = "administrator")]
        public async Task<IActionResult> AddPhysicianAsync(Physician physician) => Ok(await _physicianRepository.AddPhysicianAsync(physician));

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePhysicianAsync(int id)
        {
            await _physicianRepository.DeletePhysicianAsync(id);

            return Ok();
        }

        [HttpGet]
        [Authorize(Roles = "physician")]
        public async Task<IActionResult> GetPhysiciansAsync() => Ok(await _physicianRepository.GetPhysiciansAsync());
        [HttpGet("hierarchy/{id}")]
        [Authorize(Roles = "physician")]
        public async Task<IActionResult> GetPhysicianHierarchy(int id) => Ok(await _physicianRepository.GetHeirarchyTree(id));

        [HttpGet("{id}")]
        [Authorize(Roles = "physician")]
        public async Task<IActionResult> GetPhysicianAsync(int id) => Ok(await _physicianRepository.GetPhysicianAsync(id));

        [HttpGet("current")]
        [Authorize(Roles = "physician")]
        public async Task<IActionResult> GetCurrentPhysicianAsync() => 
            Ok(await _physicianRepository.GetPhysicianAsync(
                await _userManager.GetUserAsync(User)));

        [HttpPut("{id}")]
        [Authorize(Roles = "administrator")]
        public async Task<IActionResult> UpdatePhysicianAsync([FromBody] Physician physicianModel)
        {
            var physician = await _physicianRepository.UpdatePhysicianAsync(physicianModel);
            return Ok(physician);
        }
    }
}

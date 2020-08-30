using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System;
using System.Threading.Tasks;
using TvCv19.Frontend.Domain;
using TvCv19.Frontend.Domain.Models;
using TvCv19.Frontend.Domain.Repositories;
using TvCv19.Frontend.Domain.Services;

namespace TvCv19.Frontend.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/physician")]
    public class PhysicianController : Controller
    {
        private readonly ILogger<PhysicianController> _logger;
        private readonly IPhysicianRepository _physicianRepository;
        private readonly IRegistrationService _registrationService;

        public PhysicianController(IPhysicianRepository physicianRepository, IRegistrationService registrationService, ILogger<PhysicianController> logger)
        {
            _logger = logger;
            _physicianRepository = physicianRepository;
            _registrationService = registrationService;
        }

        [HttpPost]
        public async Task<IActionResult> AddPhysicianAsync(PhysicianRegistration physician) 
        {
             var id = await _registrationService.Register(physician.Username, physician.Password, UserType.Caregiver);
             physician.Id = id;
             return Ok(await _physicianRepository.AddPhysicianAsync(physician));
        } 

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePhysicianAsync(string id)
        {
            await _physicianRepository.DeletePhysicianAsync(id);

            return Ok();
        }

        [HttpGet]
        public async Task<IActionResult> GetPhysiciansAsync() => Ok(await _physicianRepository.GetPhysiciansAsync());
        [HttpGet("hierarchy/{id}")]
        public async Task<IActionResult> GetPhysicianHierarchy(string id) => Ok(await _physicianRepository.GetHeirarchyTree(id));

        [HttpGet("{id}")]
        public async Task<IActionResult> GetPhysicianAsync(string id) => Ok(await _physicianRepository.GetPhysicianAsync(id));

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdatePhysicianAsync([FromBody] Physician physicianModel)
        {
            var physician = await _physicianRepository.UpdatePhysicianAsync(physicianModel);
            return Ok(physician);
        }
    }
}

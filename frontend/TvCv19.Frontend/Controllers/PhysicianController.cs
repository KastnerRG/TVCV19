using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System;
using System.Threading.Tasks;
using TvCv19.Frontend.Domain;
using TvCv19.Frontend.Domain.Repositories;

namespace TvCv19.Frontend.Controllers
{
    [ApiController]
    [Route("api/physician")]
    public class PhysicianController : Controller
    {
        private readonly ILogger<PhysicianController> _logger;
        private readonly IPhysicianRepository _physicianRepository;

        public PhysicianController(IPhysicianRepository physicianRepository, ILogger<PhysicianController> logger)
        {
            _logger = logger;
            _physicianRepository = physicianRepository;
        }

        [HttpPost]
        public async Task<IActionResult> AddPhysicianAsync(Physician physician) => Ok(await _physicianRepository.AddPhysicianAsync(physician));

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

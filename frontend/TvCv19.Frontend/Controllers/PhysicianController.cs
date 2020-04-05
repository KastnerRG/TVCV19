using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TvCv19.Frontend.Domain;
using TvCv19.Frontend.Domain.Models;
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
        public async Task<IActionResult> AddPhysicianAsync([FromBody] Physician physician) => Ok(await _physicianRepository.AddPhysicianAsync(physician));

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePhysicianAsync(string id)
        {
            await _physicianRepository.DeletePhysicianAsync(id);

            return Ok();
        }

        [HttpGet]
        public async Task<IActionResult> GetPhysiciansAsync() => Ok(await _physicianRepository.GetPhysiciansAsync());

        [HttpGet("{id}")]
        public async Task<IActionResult> GetPhysicianAsync(string id) => Ok(await _physicianRepository.GetPhysicianAsync(id));

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdatePhysicianAsync([FromBody] Physician physician)
        {
            await _physicianRepository.UpdatePhysicianAsync(physician);
            return Ok();
        }
    }
}

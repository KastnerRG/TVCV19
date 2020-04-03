using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using TvCv19.Frontend.Domain;

namespace TvCv19.Frontend.Controllers
{
    [ApiController]
    [Route("patientapi")]
    public class PatientController : Controller
    {
        private ILogger<PatientController> _logger;
        private IPatientRepository _patientRepository;
         
        public PatientController(IPatientRepository patientRepository, ILogger<PatientController> logger)
        {
            _logger = logger;
            _patientRepository = patientRepository;
        }

        [HttpPost("admit")]
        public async Task<IActionResult> AdmitPatient(Patient patientModel)
        {
            var id = _patientRepository.AdmitPatient(patientModel);
            return Ok(id);
        }

        [HttpPost("discharge/{id}")]
        public async Task<IActionResult> DischargePatient(string Id)
        {
            var id = _patientRepository.DischargePatient(Id);
            return Ok(id);
        }

    }
}

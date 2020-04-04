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
            patientModel.Id = await _patientRepository.AdmitPatient(patientModel);
            return Ok(patientModel);
        }

        [HttpPut("patient")]
        public async Task<IActionResult> UpdatePatient(Patient patientModel)
        {
            patientModel = await _patientRepository.UpdatePatient(patientModel);
            return Ok(patientModel);
        }

        [HttpGet("patient/{id}")]
        public async Task<IActionResult> GetPatient(string id)
        {
            var patient = await _patientRepository.GetPatient(id);
            return Ok(patient);
        }

        [HttpGet("patients/{id}")]
        public async Task<IActionResult> GetPatients(string id)
        {
            var patient = await _patientRepository.GetPatients(id);
            return Ok(patient);
        }

        [HttpPost("discharge/{id}")]
        public async Task<IActionResult> DischargePatient(string Id)
        {
            var id = _patientRepository.DischargePatient(Id);
            return Ok(id);
        }

    }
}

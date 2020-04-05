using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using TvCv19.DailyCo.Client;
using TvCv19.DailyCo.Client.Models;
using TvCv19.Frontend.Domain;

namespace TvCv19.Frontend.Controllers
{
    [ApiController]
    [Route("patientapi")]
    public class PatientController : Controller
    {
        private const string DAILY_URL = "https://tvcv19.daily.co";
        private const string DAILY_TOKEN = "Ee910bcf0c64a3fac675bf9b04e89780a9972ba61078f188a0314b6805532ae5";

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

            using (var roomClient = new RoomClient(DAILY_URL, DAILY_TOKEN))
            {
                await roomClient.CreateAsync(new Room
                {
                    Name = patientModel.Id
                });
            }

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

        [HttpGet("physician/{id}/patients")]
        public async Task<IActionResult> GetPatients(string id)
        {
            var patient = await _patientRepository.GetPatientsByPhysician(id);
            return Ok(patient);
        }

        [HttpPost("discharge/{id}")]
        public async Task<IActionResult> DischargePatient(string id)
        {
            var _id = _patientRepository.DischargePatient(id);

            using (var roomClient = new RoomClient(DAILY_URL, DAILY_TOKEN))
            {
                await roomClient.DeleteAsync(_id);
            }

            return Ok(_id);
        }

    }
}

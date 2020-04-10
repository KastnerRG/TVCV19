using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using TvCv19.DailyCo.Client;
using TvCv19.DailyCo.Client.Models;
using TvCv19.Frontend.Domain;

namespace TvCv19.Frontend.Controllers
{
    [ApiController]
    [Route("api/patient")]
    public class PatientController : Controller
    {
        private const string DAILY_TOKEN = "Ee910bcf0c64a3fac675bf9b04e89780a9972ba61078f188a0314b6805532ae5";

        private ILogger<PatientController> _logger;
        private IPatientRepository _patientRepository;
         
        public PatientController(IPatientRepository patientRepository, ILogger<PatientController> logger)
        {
            _logger = logger;
            _patientRepository = patientRepository;
        }

        [HttpPost()]
        public async Task<IActionResult> AdmitPatient(Patient patientModel)
        {
            patientModel.Id = await _patientRepository.AdmitPatient(patientModel);

            try
            {
                using (var roomClient = new RoomClient(DAILY_TOKEN))
                {
                  await roomClient.CreateRoomAsync(new Room
                  {
                    Name = patientModel.Id
                  });
                }
            }
            catch (System.Exception)
            {
                
            }

            return Ok(patientModel);
        }

        [HttpPut]
        public async Task<IActionResult> UpdatePatient(Patient patientModel)
        {
            patientModel = await _patientRepository.UpdatePatient(patientModel);
            return Ok(patientModel);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetPatient(string id)
        {
            var patient = await _patientRepository.GetPatient(id);
            return Ok(patient);
        }

        [HttpGet("physician/{id}")]
        public async Task<IActionResult> GetPatients(string id)
        {
            var patient = await _patientRepository.GetPatientsByPhysician(id);
            return Ok(patient);
        }

        [HttpPost("discharge/{id}")]
        public async Task<IActionResult> DischargePatient(string id)
        {
            var _id = _patientRepository.DischargePatient(id);

            using (var roomClient = new RoomClient(DAILY_TOKEN))
            {
                await roomClient.DeleteRoomAsync(_id);
            }

            return Ok(_id);
        }

    }
}

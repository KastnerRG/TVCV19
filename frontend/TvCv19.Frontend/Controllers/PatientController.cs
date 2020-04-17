using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using TvCv19.DailyCo.Client;
using TvCv19.DailyCo.Client.Models;
using TvCv19.Frontend.Domain;
using TvCv19.Frontend.Domain.Models;
using TvCv19.Frontend.Domain.Repositories;

namespace TvCv19.Frontend.Controllers
{
    [ApiController]
    [Route("api/patient")]
    public class PatientController : Controller
    {
        private const string DAILY_TOKEN = "Ee910bcf0c64a3fac675bf9b04e89780a9972ba61078f188a0314b6805532ae5";

        private ILogger<PatientController> _logger;
        private IPatientRepository _patientRepository;
        private readonly IMessageRepository _messageRepository;

        public PatientController(IPatientRepository patientRepository, IMessageRepository messageRepository, ILogger<PatientController> logger)
        {
            _logger = logger;
            _patientRepository = patientRepository;
            _messageRepository = messageRepository;
        }

        [HttpPost()]
        public async Task<IActionResult> AdmitPatient(Patient patientModel)
        {
            patientModel.Id = await _patientRepository.AdmitPatient(patientModel);

            // Cannot use a GUID as room name.
            //try
            //{
            //    using (var roomClient = new RoomClient(DAILY_TOKEN))
            //    {
            //      await roomClient.CreateRoomAsync(new Room
            //      {
            //        Name = patientModel.Id
            //      });
            //    }
            //}
            //catch (Exception ex)
            //{
            //    throw ex;
            //}

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

        [HttpGet]
        public async Task<IActionResult> GetPatients() => Ok(await _patientRepository.GetPatients());

        [HttpGet("physician/{id}")]
        public async Task<IActionResult> GetPatientByPhysician(string id)
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

        [HttpGet("{id}/messages")]
        public async Task<IActionResult> GetPatientMessages(string id)
        {
            var msgs = await _messageRepository.GetMessagesByGroup(id);
            var messages = msgs.Select(x => new MessageDto(x.Sender, x.Body, x.Date, x.Id, x.IsCareInstruction));
            return Ok(messages);
        }

    }
}

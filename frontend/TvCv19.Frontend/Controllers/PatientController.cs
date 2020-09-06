using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using TvCv19.DailyCo.Client;
using TvCv19.DailyCo.Client.Models;
using TvCv19.Frontend.Domain;
using TvCv19.Frontend.Domain.Models;
using TvCv19.Frontend.Domain.Repositories;
using TvCv19.Frontend.Domain.Services;

namespace TvCv19.Frontend.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/patient")]
    public class PatientController : Controller
    {
        private ILogger<PatientController> _logger;
        private readonly IRegistrationService _registrationService;
        private IPatientRepository _patientRepository;
        private readonly IMessageRepository _messageRepository;
        private readonly RoomClient _roomClient;

        public PatientController(IPatientRepository patientRepository, IMessageRepository messageRepository, RoomClient roomClient, ILogger<PatientController> logger, IRegistrationService registrationService)
        {
            _logger = logger;
            _registrationService = registrationService;
            _patientRepository = patientRepository;
            _messageRepository = messageRepository;
            _roomClient = roomClient;
        }

        [HttpPost()]
        public async Task<IActionResult> AdmitPatient(PatientRegistration patientRegistration)
        {
            
            var id = await _registrationService.Register(patientRegistration.Username, patientRegistration.Password, UserType.Patient);
            if(string.IsNullOrEmpty(id)) {
                return StatusCode(StatusCodes.Status500InternalServerError, $"Unable to register user: ${patientRegistration.Username}");
            }
            var patient = new Patient
            {
                Id = id,
                CaregiverId = patientRegistration.CaregiverId,
                Name = patientRegistration.Name,
                Location = patientRegistration.Location
            };
            await _patientRepository.AdmitPatient(patient);

            var token = await _roomClient.CreateRoomAsync(new RoomRequest
            {
                Name = $"{patient.Id}",
                Properties = new RoomProperties() { OwnerOnlyBroadcast = true }
            });
            if(string.IsNullOrWhiteSpace(token))
            {
                _logger.LogWarning($"Unable to create room for patient: {patient.Name} id: {patient.Id}");
            }
            patient.Token = token;
            patient.AdmissionStatus = AdmissionStatus.Admitted;
            await _patientRepository.UpdatePatient(patient);
            return Ok(patient);
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
            var patients = await _patientRepository.GetPatientsByPhysician(id);
            return Ok(patients);
        }

        [HttpPut("discharge/{id}")]
        public async Task<IActionResult> DischargePatient(string id)
        {
            var _id = await _patientRepository.DischargePatient(id);

            await _roomClient.DeleteRoomAsync(_id);

            return Ok(_id);
        }

        [HttpGet("{id}/messages")]
        public async Task<IActionResult> GetPatientMessages(string id)
        {
            var msgs = await _messageRepository.GetMessagesByGroup(id);
            var messages = msgs.Select(x => new MessageDto(x.Sender, x.Body, x.Date, x.Id, x.IsCareInstruction, x.IsAudio, x.IsImage, x.Stats, x.IsEscalation));
            return Ok(messages);
        }

        [HttpGet("delete/all")]
        public async Task<IActionResult> DeleteAllPatients() {
            var patients = await _patientRepository.GetPatients();
            foreach (var patient in patients)
            {
                await _patientRepository.DischargePatient(patient.Id);
                await _roomClient.DeleteRoomAsync(patient.Id);
            }

            var rooms = await _roomClient.GetRoomsAsync();
            foreach (var room in rooms)
            {
                await _roomClient.DeleteRoomAsync(room.Name);
            }
            return Ok("Deleted all rooms and discharged all patients");
        }

    }
}

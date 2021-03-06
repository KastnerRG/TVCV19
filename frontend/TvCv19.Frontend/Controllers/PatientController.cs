using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using TvCv19.DailyCo.Client;
using TvCv19.DailyCo.Client.Models;
using TvCv19.Frontend.Domain;
using TvCv19.Frontend.Domain.Models;
using TvCv19.Frontend.Domain.Repositories;

namespace TvCv19.Frontend.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/patient")]
    public class PatientController : Controller
    {
        private ILogger<PatientController> _logger;
        private IPatientRepository _patientRepository;
        private readonly IMessageRepository _messageRepository;
        private readonly RoomClient _roomClient;

        public PatientController(IPatientRepository patientRepository, IMessageRepository messageRepository, RoomClient roomClient, ILogger<PatientController> logger)
        {
            _logger = logger;
            _patientRepository = patientRepository;
            _messageRepository = messageRepository;
            _roomClient = roomClient;
        }

        [HttpPost()]
        public async Task<IActionResult> AdmitPatient([FromBody]Patient patientModel)
        {
            patientModel.Id = await _patientRepository.AdmitPatient(patientModel);

            var token = await _roomClient.CreateRoomAsync(new RoomRequest
            {
                Name = $"{patientModel.Id}",
                Properties = new RoomProperties() { OwnerOnlyBroadcast = true }
            });
            if(string.IsNullOrWhiteSpace(token))
            {
                _logger.LogWarning($"Unable to create room for patient: {patientModel.Name} id: {patientModel.Id}");
            }
            patientModel.Token = token;
            patientModel.AdmissionStatus = AdmissionStatus.Admitted;
            await _patientRepository.UpdatePatient(patientModel);
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
            var patients = await _patientRepository.GetPatientsByPhysician(id);
            return Ok(patients);
        }

        [HttpPost("discharge/{id}")]
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

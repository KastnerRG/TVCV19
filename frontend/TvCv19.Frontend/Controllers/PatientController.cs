using System.Security.Claims;
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
using Microsoft.AspNetCore.Http;

using Microsoft.AspNetCore.Identity;
namespace TvCv19.Frontend.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/patient")]
    public class PatientController : Controller
    {
        private ILogger<PatientController> _logger;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly UserManager<ApplicationLogin> _userManager;
        private IPatientRepository _patientRepository;
        private readonly IMessageRepository _messageRepository;
        private readonly RoomClient _roomClient;

        public PatientController(IHttpContextAccessor httpContextAccessor, UserManager<ApplicationLogin> userManager, IPatientRepository patientRepository, IMessageRepository messageRepository, RoomClient roomClient, ILogger<PatientController> logger)
        {
            _logger = logger;
            _patientRepository = patientRepository;
            _httpContextAccessor = httpContextAccessor;
            _userManager = userManager;
            _messageRepository = messageRepository;
            _roomClient = roomClient;
        }

        [HttpPost()]
        [Authorize(Roles = "patient")]
        public async Task<IActionResult> AdmitPatient([FromBody] PatientRegistration patientRegistration)
        {
            var username = _httpContextAccessor.HttpContext.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var applicationLogin = await _userManager.FindByNameAsync(username);            
           
            applicationLogin.UserName = patientRegistration.Username;
            applicationLogin.PasswordHash = patientRegistration.Password;
            await _userManager.UpdateAsync(applicationLogin);

            var patientModel = new Patient { Name = patientRegistration.Name, Location = patientRegistration.Location };
            patientModel.Id = await _patientRepository.AdmitPatient(patientModel);

            var token = await _roomClient.CreateRoomAsync(new RoomRequest
            {
                Name = $"{ patientModel.Id}",
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
        [Authorize(Roles = "physician, patient")]
        public async Task<IActionResult> UpdatePatient(Patient patientModel)
        {
            patientModel = await _patientRepository.UpdatePatient(patientModel);
            return Ok(patientModel);
        }

        [HttpGet("{id}")]
        [Authorize(Roles = "physician, patient")]
        public async Task<IActionResult> GetPatient(int id)
        {
            var patient = await _patientRepository.GetPatient(id);
            return Ok(patient);
        }

        [HttpGet]
        [Authorize(Roles = "patient")]
        public async Task<IActionResult> GetPatients() => Ok(await _patientRepository.GetPatients());

        [HttpGet("physician/{id}")]
        [Authorize(Roles = "physician")]
        public async Task<IActionResult> GetPatientByPhysician(int id)
        {
            var patients = await _patientRepository.GetPatientsByPhysician(id);
            return Ok(patients);
        }

        [HttpPost("discharge/{id}")]
        [Authorize(Roles = "physician")]
        public async Task<IActionResult> DischargePatient(int id)
        {
            var _id = await _patientRepository.DischargePatient(id);

            await _roomClient.DeleteRoomAsync(_id.ToString());

            return Ok(_id);
        }

        [HttpGet("{id}/messages")]
        [Authorize(Roles = "physician")]
        public async Task<IActionResult> GetPatientMessages(int id)
        {
            var msgs = await _messageRepository.GetMessagesByGroup(id);
            var messages = msgs.Select(x => new MessageDto(x.Sender, x.Body, x.Date, x.Id.ToString(), x.IsCareInstruction, x.IsAudio, x.IsImage, x.Stats, x.IsEscalation));
            return Ok(messages);
        }

        [HttpGet("delete/all")]
        [Authorize(Roles = "administrator")]
        public async Task<IActionResult> DeleteAllPatients() {
            var patients = await _patientRepository.GetPatients();
            foreach (var patient in patients)
            {
                await _patientRepository.DischargePatient(patient.Id);
                await _roomClient.DeleteRoomAsync(patient.Id.ToString());
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

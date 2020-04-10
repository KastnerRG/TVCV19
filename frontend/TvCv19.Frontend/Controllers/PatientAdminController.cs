using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using TvCv19.DailyCo.Client;
using TvCv19.DailyCo.Client.Models;
using TvCv19.Frontend.Domain;

namespace TvCv19.Frontend.Controllers
{
    [ApiController]
    [Route("physicianapi")]
    public class PatientAdminController : Controller
    {
        private const string DAILY_TOKEN = "Ee910bcf0c64a3fac675bf9b04e89780a9972ba61078f188a0314b6805532ae5";

        private ILogger<PatientController> _logger;
        private PhysicianRepository physicianRepository;
         
        public PatientAdminController(PhysicianRepository physicianRepository, ILogger<PatientController> logger)
        {
            _logger = logger;
            this.physicianRepository = physicianRepository;
        }

        [HttpPost("add")]
        public async Task<IActionResult> AdmitPatient(Physician physicianModel)
        {
            physicianModel.Id = await physicianRepository.AddPhysician(physicianModel);

            using (var roomClient = new RoomClient(DAILY_TOKEN))
            {
                await roomClient.CreateRoomAsync(new Room
                {
                    Name = physicianModel.Id
                });
            }

            return Ok(physicianModel);
        }

  
    }
}

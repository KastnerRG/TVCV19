using System.IO;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using TvCv19.Frontend.Domain.Repositories;

namespace TvCv19.Frontend.Controllers
{

    [Route("api/audio")]
    public class AudioController : Controller {
        private readonly IAudioRepository _repository;

        public AudioController(IAudioRepository repository)
        {
            _repository = repository;
        }

        [HttpPost]
        public async Task<IActionResult> RecordedAudio(AudioMessageDto message) {
             await _repository.AddRecording(message);
            return Ok(new {message.FileName});
        }

        [HttpGet("{fileName}")]
        public async Task<IActionResult> GetRecording(string fileName) {
            var message = await _repository.GetRecording(fileName);
            return File(message.Recording, "audio/mpeg");
        }
    }

    public class AudioMessageDto {
      public string FileName { get; set; }
      public IFormFile Recording { get; set; }
    }
}
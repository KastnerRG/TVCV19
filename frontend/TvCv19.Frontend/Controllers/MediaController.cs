using System.IO;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using TvCv19.Frontend.Domain.Repositories;

namespace TvCv19.Frontend.Controllers
{

    [Route("api/media")]
    public class MediaController : Controller {
        private readonly IMediaRepository _repository;

        public MediaController(IMediaRepository repository)
        {
            _repository = repository;
        }

        [HttpPost]
        public async Task<IActionResult> AddMedia(MediaMessage message) {
             await _repository.AddMedia(message.ToMedia());
            return Ok(new {message.FileName});
        }

        [HttpGet("{fileName}")]
        public async Task<IActionResult> GetMedia(string fileName) {
            var media = await _repository.GetMedia(fileName);
            return File(media.File, media.MimeType);
        }
    }

    public class MediaMessage {
      public string FileName { get; set; }
      public string MimeType { get; set; }
      public IFormFile File { get; set; }
    }
}
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using TvCv19.Frontend.Controllers;
using TvCv19.Frontend.Domain.Models;

namespace TvCv19.Frontend.Domain.Repositories
{
    public interface IMediaRepository
    {
        Task<string> AddMedia(Media message);
        Task<Media> GetMedia(string id);
    }

    public class Media : IDbEntity {
        public string Id { get; set; }
        public string FileName { get; set; }
        public byte[] File { get; set; }
        public string MimeType { get; set; }
    }

    public static class MediaMessageExtensions {
        public static Media ToMedia(this MediaMessage message) {
            IFormFile recording = message.File;
            var media = new Media(); 
            media.FileName = message.FileName;
            media.MimeType = message.MimeType;
            using (var ms = new MemoryStream())
            {
                recording.CopyTo(ms);
                media.File = ms.ToArray();

            }
            return media;
        }
    }

    public class PocMediaRepository : IMediaRepository
    {
        private static List<Media> _mediaList = new List<Media>();

        public Task<string> AddMedia(Media media)
        {
            _mediaList.Add(media);
            return Task.FromResult(media.FileName);
        }

        public Task<Media> GetMedia(string id)
        {
            return Task.FromResult(_mediaList.FirstOrDefault(x => x.FileName == id));
        }
    }
}
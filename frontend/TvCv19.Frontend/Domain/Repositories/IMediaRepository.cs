using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
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
        Task<int> AddMedia(Media message);
        Task<Media> GetMedia(int id);
    }

    public class Media : IDbEntity
    {
        public int Id { get; set; }
        [Required]
        public string FileName { get; set; }
        [Required]
        public byte[] File { get; set; }
        [Required]
        public string MimeType { get; set; }
    }

    public static class MediaMessageExtensions
    {
        public static Media ToMedia(this MediaMessage message)
        {
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
}
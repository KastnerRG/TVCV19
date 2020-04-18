using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using TvCv19.Frontend.Controllers;
using TvCv19.Frontend.Domain.Models;

namespace TvCv19.Frontend.Domain.Repositories
{
    public interface IAudioRepository
    {
        Task<string> AddRecording(AudioMessageDto message);
        Task<AudioMessage> GetRecording(string fileName);
    }

    public class AudioMessage {
        public string FileName { get; set; }
        public byte[] Recording { get; set; }
    }

    public static class AudioMessageExtensions {
        public static AudioMessage ToAudioMessage(this AudioMessageDto dto) {
            IFormFile recording = dto.Recording;
            var message = new AudioMessage(); 
            message.FileName = dto.FileName;
            using (var ms = new MemoryStream())
            {
                recording.CopyTo(ms);
                message.Recording = ms.ToArray();

            }
            return message;
        }
    }


    public class PocAudioRepository : IAudioRepository
    {
        private static List<AudioMessage> _messages = new List<AudioMessage>();

        public Task<string> AddRecording(AudioMessageDto message)
        {
            _messages.Add(message.ToAudioMessage());
            return Task.FromResult(message.FileName);
        }

        public Task<AudioMessage> GetRecording(string fileName)
        {
            return Task.FromResult(_messages.FirstOrDefault(x => x.FileName == fileName));
        }
    }
}

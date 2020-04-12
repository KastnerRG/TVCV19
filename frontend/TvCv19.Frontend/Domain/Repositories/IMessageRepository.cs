using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TvCv19.Frontend.Domain.Models;

namespace TvCv19.Frontend.Domain.Repositories
{
    public interface IMessageRepository
    {
        Task<string> AddMessage(Message message);
        Task<IEnumerable<Message>> GetMessagesByGroup(string groupId);
    }

    public class PocMessageRepository : IMessageRepository
    {
        private static List<Message> _messages = new List<Message>();

        public Task<string> AddMessage(Message message)
        {
            _messages.Add(message);
            return Task.FromResult(message.Id);
        }

        public Task<IEnumerable<Message>> GetMessagesByGroup(string groupId)
        {
            return Task.FromResult(_messages.Where(m => m.GroupId == groupId));
        }
    }
}

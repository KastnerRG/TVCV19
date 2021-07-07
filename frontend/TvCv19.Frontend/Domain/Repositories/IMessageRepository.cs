using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TvCv19.Frontend.Domain.Models;

namespace TvCv19.Frontend.Domain.Repositories
{
    public interface IMessageRepository
    {
        Task<int> AddMessage(Message message);
        Task<IEnumerable<Message>> GetMessagesByGroup(int groupId);
    }
}

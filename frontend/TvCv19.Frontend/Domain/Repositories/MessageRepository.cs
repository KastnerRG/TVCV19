using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Dapper;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using TvCv19.Frontend.Domain.Models;

namespace TvCv19.Frontend.Domain.Repositories
{
    public class MessageRepository : IMessageRepository
    {
        public async Task<string> AddMessage(Message message)
        {
            message.Id = Guid.NewGuid().ToString("N");;

            if (message.Stats != null)
            {
                message.Stats.Id = Guid.NewGuid().ToString("N");;
            }

            using var context = new MedeccContext();

            await context.AddAsync(message);
            await context.SaveChangesAsync();

            return message.Id;
        }

        public Task<IEnumerable<Message>> GetMessagesByGroup(string groupId)
        {
            using var context = new MedeccContext();

            var messages = from m in context.Messages
                           where m.GroupId == groupId
                           select m;

            return Task.FromResult((IEnumerable<Message>)messages.Include(m => m.Stats).ToArray());
        }
    }
}

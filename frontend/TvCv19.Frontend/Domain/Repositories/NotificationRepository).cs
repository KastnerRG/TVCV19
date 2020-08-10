using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TvCv19.Frontend.Domain.Repositories;

namespace TvCv19.Frontend.Domain
{


    public class NotificationRepository : INotificationRepository
    {
        public async Task<Notification> AddNotification(Notification notifiaction)
        {
            using var context = new MedeccContext();

            await context.AddAsync(notifiaction);
            await context.SaveChangesAsync();

            return notifiaction;
        }

        public async Task<int> DeleteNotification(int id)
        {
            using var context = new MedeccContext();

            context.Remove(await GetNotifications(id));
            await context.SaveChangesAsync();

            return id;
        }

        public Task<IEnumerable<Notification>> GetNotifications(int id)
        {
            using var context = new MedeccContext();

            var notifications = from n in context.Notifications
                                where n.RecieverId == id
                                select n;

            return Task.FromResult((IEnumerable<Notification>)notifications.ToArray());
        }
    }
}
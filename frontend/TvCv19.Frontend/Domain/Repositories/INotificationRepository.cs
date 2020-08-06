using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;
using TvCv19.Frontend.Domain.Models;
using TvCv19.Frontend.Domain.Repositories;

namespace TvCv19.Frontend.Domain
{
    public interface INotificationRepository
    {
        Task<IEnumerable<Notification>> GetNotifications(string recieverId);
        Task<string> DeleteNotification(string id);
        Task<Notification> AddNotification(Notification notification);
    }

    public class PocNotificationRepository : INotificationRepository
    {
        private static List<Notification> _notifications = new List<Notification>();

        public Task<Notification> AddNotification(Notification notifiaction)
        {
            _notifications.Add(notifiaction);

            return Task.FromResult(notifiaction);
        }

        public Task<string> DeleteNotification(string id)
        {
            _notifications.Remove(_notifications.FirstOrDefault(x => x.Id == id));
            return Task.FromResult(id);
        }

        public Task<IEnumerable<Notification>> GetNotifications(string id)
        {
            return Task.FromResult(_notifications.Where(x => x.RecieverId == id));
        }
    }

    public class Notification : IDbEntity
    {
        public string Id { get; set; }
        [Required]
        public string RecieverId { get; set; }
        [Required]
        public string PatientId { get; set; }
        public string Link { get; set; }
        [NotMapped]
        public string Message { get; set; }
        public DateTime? Date { get; set; }
        public bool IsEscalation { get; set; }
    }
}
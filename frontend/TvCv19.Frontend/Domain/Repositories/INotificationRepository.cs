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
        Task<IEnumerable<Notification>> GetNotifications(int recieverId);
        Task<int> DeleteNotification(int id);
        Task<Notification> AddNotification(Notification notification);
    }

    public class Notification : IDbEntity
    {
        public int Id { get; set; }
        [Required]
        public int RecieverId { get; set; }
        [Required]
        public int PatientId { get; set; }
        public string Link { get; set; }
        [NotMapped]
        public string Message { get; set; }
        public DateTime? Date { get; set; }
        public bool IsEscalation { get; set; }
    }
}
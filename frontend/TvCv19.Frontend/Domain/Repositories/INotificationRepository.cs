using System;
using System.Collections.Generic;
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
        Task AddPushSubscription(Subscription sub);
        Task<IEnumerable<Subscription>> GetSubscriptions(string id);
    }

    public class PocNotificationRepository : INotificationRepository
    {
        private static List<Notification> _notifications = new List<Notification>();
        private static Dictionary<string, List<Subscription>> _subscriptions = new Dictionary<string, List<Subscription>>();

        public Task AddPushSubscription(Subscription sub) {
            return _subscriptions.ContainsKey(sub.Id) ? Task.Run(() => _subscriptions[sub.Id].Add(sub)) : Task.Run(() => _subscriptions.Add(sub.Id, new List<Subscription>() {sub}));
        }

        public Task<IEnumerable<Subscription>> GetSubscriptions(string id)
        {
            _subscriptions.TryGetValue(id, out var value);
            return Task.FromResult((IEnumerable<Subscription>)value);
        }
        
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
        public string RecieverId { get; set; }
        public string PatientId { get; set; }
        public string Link { get; set; }
        public string Message { get; set; }
        public DateTime Date { get; set; }
        public bool IsEscalation { get; set; }
    }

    public class Subscription {
        public string Id { get; set; }
       public string Endpoint { get; set; }
       public SubscriptionKeys Keys { get; set; }
    }

    public class SubscriptionKeys {
        public string auth { get; set; }
        public string p256dh { get; set; }
    }


    public class SubscriptionDb : IDbEntity {
       public string Id { get; set; }
       public string Endpoint { get; set; }
        public string auth { get; set; }
        public string p256dh { get; set; }
    }

  
}
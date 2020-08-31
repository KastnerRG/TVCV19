using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace TvCv19.Frontend.Domain
{
    public class NotificationRepository : BaseRepository, INotificationRepository
    {
        private static Dictionary<string, List<Subscription>> _subscriptions = new Dictionary<string, List<Subscription>>();
        public async Task<Notification> AddNotification(Notification notifiaction)
        {
            notifiaction.Id = Guid.NewGuid().ToString().Replace("-", string.Empty);
            var sql = $@"INSERT INTO medecc.notification
                         (id,reciever_id,patient_id,link,date, is_escalation)
                         VALUES(@Id, @RecieverId, @PatientId, @Link,@Date, @IsEscalation)";
            await ExecuteAsync<Notification>(sql, notifiaction);
            return notifiaction;
        }

        public async Task<string> DeleteNotification(string id)
        {
            var sql = $@"DELETE FROM medecc.notification
                         WHERE id = @id";
            var param = new { id };
            await ExecuteAsync<Notification>(sql, param);
            return id;
        }

        public async Task<IEnumerable<Notification>> GetNotifications(string id)
        {

            var sql = $@"SELECT id, reciever_id as recieverId, patient_id as patientId, link, date, is_escalation as isEscalation
                         FROM medecc.notification
                         WHERE reciever_id = @id";
            var param = new { id };
            return await GetAsync<Notification>(sql, param);
        }

        public Task AddPushSubscription(string id, Subscription sub) {
            return _subscriptions.ContainsKey(id) ? Task.Run(() => _subscriptions[id].Add(sub)) : Task.Run(() => _subscriptions.Add(id, new List<Subscription>() {sub}));
        }

        public Task<List<Subscription>> GetSubscriptions(string id)
        {
            _subscriptions.TryGetValue(id, out var value);
            return Task.FromResult(value);
        }
    }
}
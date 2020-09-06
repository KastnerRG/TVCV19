using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TvCv19.Frontend.Domain
{
    public class NotificationRepository : BaseRepository, INotificationRepository
    {
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

        public async Task AddPushSubscription(Subscription sub) {
            
            var sql = $@"INSERT INTO medecc.chromepush
                         (id, endpoint, auth, p256dh)
                         VALUES (@Id, @Endpoint, @auth, @p256dh)";
            await ExecuteAsync<SubscriptionDb>(sql, new {sub.Id, sub.Endpoint, sub.Keys.auth, sub.Keys.p256dh});
        }

        public async Task<IEnumerable<Subscription>> GetSubscriptions(string id)
        {
            var sql = @"SELECT * FROM medecc.chromepush
                        WHERE id = @id";
            var result = await GetAsync<SubscriptionDb>(sql, new {id});
            return result.Select(r => new Subscription(){
                Id = r.Id,
                Endpoint = r.Endpoint,
                Keys = new SubscriptionKeys(){
                    auth = r.auth,
                    p256dh = r.p256dh
                }
            });
        }
    }
}
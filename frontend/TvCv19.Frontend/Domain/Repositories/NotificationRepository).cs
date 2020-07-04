﻿using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace TvCv19.Frontend.Domain
{


    public class NotificationRepository : BaseRepository, INotificationRepository
    {

        public async Task<Notification> AddNotification(Notification notifiaction)
        {
            notifiaction.Id = Guid.NewGuid().ToString().Replace("-", string.Empty);
            var sql = $@"INSERT INTO medecc.notification
                         (id,sender_id,reciever_id,patient_id,link,date)
                         VALUES(@Id, @SenderId, @RecieverId, @PatientId, @Link,@Date)";
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

            var sql = $@"SELECT id, sender_id as senderId, reciever_id as recieverId, patient_id as patientId, link, date
                         FROM medecc.notification
                         WHERE reciever_id = @id";
            var param = new { id };
            return await GetAsync<Notification>(sql, param);
        }
    }
}
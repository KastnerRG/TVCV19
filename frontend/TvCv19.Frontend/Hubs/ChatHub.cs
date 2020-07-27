using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TvCv19.Frontend.Domain;
using TvCv19.Frontend.Domain.Models;
using TvCv19.Frontend.Domain.Repositories;

namespace TvCv19.Frontend.Hubs
{
    //[Authorize]
    public class ChatHub : Hub
    {
        private readonly IPhysicianRepository _physicianRepository;
        private readonly IPatientRepository _patientRepository;
        private readonly IMessageRepository _messageRepository;
        private readonly INotificationRepository _notificationRepository;

        public ChatHub(IPhysicianRepository physicianRepository, IPatientRepository patientRepository, IMessageRepository messageRepository, INotificationRepository notificationRepository)
        {
            _physicianRepository = physicianRepository;
            _patientRepository = patientRepository;
            _messageRepository = messageRepository;
            _notificationRepository = notificationRepository;
        }
        public Task SubscribeAsync(string patientId) =>
            Groups.AddToGroupAsync(Context.ConnectionId, patientId);

        public Task UnsubscribeAsync(string patientId) =>
            Groups.RemoveFromGroupAsync(Context.ConnectionId, patientId);

        public async Task SendMessageAsync(string patientId, string physicianId, string message, Stats stats, bool isCareInstruction, bool isAudio, bool isImage, bool isEscalation)
        {
            var date = DateTime.Now;
            var physician = await _physicianRepository.GetPhysicianAsync(physicianId);
            var recieverId = physician.Hierarchy == Hierarchy.FirstLine ? physician.SupervisorId : (await _patientRepository.GetPatient(patientId)).CaregiverId;
            Message dbMessage = new Message(patientId, message, physician, date, isCareInstruction, isAudio, isImage, stats, recieverId, isEscalation);
            var id = await _messageRepository.AddMessage(dbMessage);
            await AddNotifications(patientId, physician, recieverId, isEscalation);
            await Clients.Group(patientId).SendAsync("ReceiveMessage", dbMessage.ToMessageModel(id, physicianId));
        }

        private async Task AddNotifications(string patientId, Physician physician, string recieverId, bool isEscalation)
        {
            var recieverIds = new List<string> { recieverId };
            if (physician.Hierarchy == Hierarchy.SecondLine)
            {
                recieverIds.Add(physician.SupervisorId);
            }
            if (physician.Hierarchy == Hierarchy.Commander)
            {
                var patientCarerId = (await _patientRepository.GetPatient(patientId)).CaregiverId;
                var carerSupervisorId = (await _physicianRepository.GetPhysicianAsync(patientCarerId)).SupervisorId;
                recieverIds.Add(patientCarerId);
                recieverIds.Add(carerSupervisorId);
            }
            var notifications = await recieverIds.SelectManyAsync(id => _notificationRepository.GetNotifications(id));

            if (notifications.Any())
            {
                foreach (var notification in notifications)
                {
                    if (!notification.IsEscalation)
                    {
                        await _notificationRepository.DeleteNotification(notification.Id);
                    }
                }
            }
            if (!isEscalation && physician.Hierarchy != Hierarchy.Commander)
            {
                await _notificationRepository.AddNotification(new Notification
                {
                    Id = Guid.NewGuid().ToString(),
                    IsEscalation = isEscalation,
                    Date = DateTime.Now,
                    Link = $"/caregiver/{recieverId}/patient/{patientId}/chat",
                    RecieverId = recieverId,
                    PatientId = patientId
                });
            }
            else
            {
                foreach (var id in recieverIds)
                {
                    await _notificationRepository.AddNotification(new Notification
                    {
                        Id = Guid.NewGuid().ToString(),
                        IsEscalation = isEscalation,
                        Date = DateTime.Now,
                        Link = $"/caregiver/{id}/patient/{patientId}/chat",
                        RecieverId = id,
                        PatientId = patientId
                    });
                }
            }
        }
    }

    public static class MessageExtensions
    {
        public static MessageModel ToMessageModel(this Message m, string id, string physicianId)
        {
            return new MessageModel(m, id, physicianId);
        }

        public static async Task<IEnumerable<T1>> SelectManyAsync<T, T1>(this IEnumerable<T> enumeration, Func<T, Task<IEnumerable<T1>>> func)
        {
            return (await Task.WhenAll(enumeration.Select(func))).SelectMany(s => s);
        }
    }

    public class MessageModel
    {
        public MessageModel(Message m, string id, string physicianId)
        {
            Id = id;
            PatientId = m.GroupId;
            PhysicianId = physicianId;
            IsImage = m.IsImage;
            IsCareInstruction = m.IsCareInstruction;
            IsAudio = m.IsAudio;
            Name = m.Sender;
            Message = m.Body;
            Stats = m.Stats;
            Date = m.Date;
            ReceiverId = m.ReceiverId;
            IsEscalation = m.IsEscalation;
        }

        public string PatientId { get; set; }
        public string PhysicianId { get; }
        public string ReceiverId { get; set; }
        public bool IsEscalation { get; set; }
        public string Id { get; set; }
        public bool IsImage { get; set; }
        public bool IsCareInstruction { get; set; }
        public bool IsAudio { get; set; }
        public string Name { get; set; }
        public string Message { get; set; }
        public Stats Stats { get; set; }
        public DateTime Date { get; set; }
    }
}

using Microsoft.AspNetCore.SignalR;
using System;
using System.Threading.Tasks;
using TvCv19.Frontend.Domain.Models;
using TvCv19.Frontend.Domain.Repositories;

namespace TvCv19.Frontend.Hubs
{
    public class ChatHub : Hub
    {
        private readonly IPhysicianRepository _physicianRepository;
        private readonly IMessageRepository _messageRepository;

        public ChatHub(IPhysicianRepository physicianRepository, IMessageRepository messageRepository)
        {
            _physicianRepository = physicianRepository;
            _messageRepository = messageRepository;
        }
        public Task SubscribeAsync(string patientId) =>
            this.Groups.AddToGroupAsync(Context.ConnectionId, patientId);

        public Task UnsubscribeAsync(string patientId) =>
            this.Groups.RemoveFromGroupAsync(Context.ConnectionId, patientId);

        public async Task SendMessageAsync(string patientId, string physicianId, string message, Stats stats, bool isCareInstruction, bool isAudio, bool isImage)
        {
            var date = DateTime.Now;
            var physician = await _physicianRepository.GetPhysicianAsync(physicianId);
            Message dbMessage = new Message(patientId, message, physician.Name, date, isCareInstruction, isAudio, isImage, stats);
            var id = await _messageRepository.AddMessage(dbMessage);
            await Clients.Group(patientId).SendAsync("ReceiveMessage", dbMessage.ToMessageModel(id, physicianId));
        }
    }

    public static class MessageExtensions {
        public static MessageModel ToMessageModel(this Message m, string id, string physicianId) {
            return new MessageModel(id, m.GroupId, physicianId, m.IsImage, m.IsCareInstruction, m.IsAudio, m.Sender, m.Body, m.Stats, m.Date);
        }
    }

    public class MessageModel {
        public MessageModel(string id, string patientId, string physicianId, bool isImage, bool isCareInstruction, bool isAudio, string name, string message, Stats stats, DateTime date)
        {
            Id = id;
            PatientId = patientId;
            PhysicianId = physicianId;
            IsImage = isImage;
            IsCareInstruction = isCareInstruction;
            IsAudio = isAudio;
            Name = name;
            Message = message;
            Stats = stats;
            Date = date;
        }
        public string PatientId { get; set; }
        public string PhysicianId { get; }
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

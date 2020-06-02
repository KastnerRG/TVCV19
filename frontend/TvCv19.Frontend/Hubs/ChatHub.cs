using Microsoft.AspNetCore.SignalR;
using System;
using System.Threading.Tasks;
using TvCv19.Frontend.Domain;
using TvCv19.Frontend.Domain.Models;
using TvCv19.Frontend.Domain.Repositories;

namespace TvCv19.Frontend.Hubs
{
    public class ChatHub : Hub
    {
        private readonly IPhysicianRepository _physicianRepository;
        private readonly IPatientRepository _patientRepository;
        private readonly IMessageRepository _messageRepository;

        public ChatHub(IPhysicianRepository physicianRepository, IPatientRepository patientRepository, IMessageRepository messageRepository)
        {
            _physicianRepository = physicianRepository;
            _patientRepository = patientRepository;
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
            //todo figure out how commander fits in
            var recieverId = physician.Hierarchy == Hierarchy.FirstLine ? physician.SupervisorId : (await _patientRepository.GetPatient(patientId)).CaregiverId;
            Message dbMessage = new Message(patientId, message, physician, date, isCareInstruction, isAudio, isImage, stats, recieverId);
            var id = await _messageRepository.AddMessage(dbMessage);
            await Clients.Group(patientId).SendAsync("ReceiveMessage", dbMessage.ToMessageModel(id, physicianId));
        }
    }

    public static class MessageExtensions {
        public static MessageModel ToMessageModel(this Message m, string id, string physicianId) {
            
            return new MessageModel(m, id, physicianId);
        }
    }

    public class MessageModel {
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
        }
   
        public string PatientId { get; set; }
        public string PhysicianId { get; }
        public string ReceiverId { get; set; }
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

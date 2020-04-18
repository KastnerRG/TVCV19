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

        public async Task SendMessageAsync(string patientId, string physicianId, string message, bool isCareInstruction, bool isAudio, bool isImage)
        {
            var date = DateTime.Now;
            var physician = await _physicianRepository.GetPhysicianAsync(physicianId);
            var id = await _messageRepository.AddMessage(new Message(patientId, message, physician.Name, date, isCareInstruction, isAudio, isImage));
            await Clients.Group(patientId).SendAsync("ReceiveMessage", message, physician.Name, date, id, isCareInstruction, isAudio, isImage);
        }
    }
}

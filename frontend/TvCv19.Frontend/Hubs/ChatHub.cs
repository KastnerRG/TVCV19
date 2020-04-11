using Microsoft.AspNetCore.SignalR;
using System;
using System.Threading.Tasks;
using TvCv19.Frontend.Domain.Repositories;

namespace TvCv19.Frontend.Hubs
{
    public class ChatHub : Hub
    {
        private readonly IPhysicianRepository _physicianRepository;
        public ChatHub(IPhysicianRepository physicianRepository)
        {
            _physicianRepository = physicianRepository;
        }
        public Task SubscribeAsync(string patientId) =>
            this.Groups.AddToGroupAsync(Context.ConnectionId, patientId);

        public Task UnsubscribeAsync(string patientId) =>
            this.Groups.RemoveFromGroupAsync(Context.ConnectionId, patientId);

        public async Task SendMessageAsync(string patientId, string physicianId, string message, bool isCareInstruction)
        {
            var physician = await _physicianRepository.GetPhysicianAsync(physicianId);
            await Clients.Group(patientId).SendAsync("ReceiveMessage", message, physician.Name, DateTime.Now, isCareInstruction);
        }
    }
}

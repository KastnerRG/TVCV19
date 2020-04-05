using Microsoft.AspNetCore.SignalR;
using System.Threading.Tasks;

namespace TvCv19.Frontend.Hubs
{
    public class ChatHub : Hub
    {
        public Task SubscribeAsync(string patientId) =>
            this.Groups.AddToGroupAsync(Context.ConnectionId, patientId);

        public Task UnsubscribeAsync(string patientId) =>
            this.Groups.RemoveFromGroupAsync(Context.ConnectionId, patientId);

        public Task SendMessageAsync(string patientId, string physicianId, string message, bool isCareInstruction) =>
            Clients.Group(patientId).SendAsync("ReceiveMessage", message, physicianId, isCareInstruction);
    }
}

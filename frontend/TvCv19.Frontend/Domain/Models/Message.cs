using System;
namespace TvCv19.Frontend.Domain.Models
{
    public class Message
    {
        public Message(string groupId, string message, string sender, DateTime date, bool isCareInstruction)
        {
            GroupId = groupId;
            Body = message;
            Sender = sender;
            Date = date;
            IsCareInstruction = isCareInstruction;
        }

        public string Id { get; set; } = Guid.NewGuid().ToString();
        public string GroupId { get; }
        public string Body { get; }
        public string Sender { get; }
        public DateTime Date { get; }
        public bool IsCareInstruction { get; }
    }
}

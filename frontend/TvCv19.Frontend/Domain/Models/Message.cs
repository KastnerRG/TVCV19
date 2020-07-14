using System;
namespace TvCv19.Frontend.Domain.Models
{
    public class Message : IDbEntity
    {
        public Message() { }

        public Message(string groupId, string message, Physician physician, DateTime date, bool isCareInstruction, bool isAudio, bool isImage, Stats stats, string recieverId)
        {
            GroupId = groupId;
            Body = message;
            Sender = physician.Name;
            Date = date;
            IsCareInstruction = isCareInstruction;
            IsAudio = isAudio;
            IsImage = isImage;
            Stats = stats;
            ReceiverId = recieverId;
        }

        public string Id { get; set; } 
        public string GroupId { get; }
        public string Body { get; }
        public string Sender { get; }
        public string ReceiverId { get; set; }
        public DateTime Date { get; }
        public bool IsCareInstruction { get; }
        public bool IsAudio { get; }
        public bool IsImage { get; }
        public Stats Stats { get; set; }
    }
    public class Stats : IDbEntity
    {
        public string Id { get; set; } 
        public string PR { get; set; }
        public string TV { get; set; }
        public string PP { get; set; }
        public string IE { get; set; }
        public string MP { get; set; }
        public string O2 { get; set; }
    }
}

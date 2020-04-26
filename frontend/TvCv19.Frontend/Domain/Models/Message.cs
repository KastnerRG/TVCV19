using System;
namespace TvCv19.Frontend.Domain.Models
{
    public class Message
    {
        public Message(string groupId, string message, string sender, DateTime date, bool isCareInstruction, bool isAudio, bool isImage, Stats stats)
        {
            GroupId = groupId;
            Body = message;
            Sender = sender;
            Date = date;
            IsCareInstruction = isCareInstruction;
            IsAudio = isAudio;
            IsImage = isImage;
            Stats = stats;
        }

        public string Id { get; set; } = Guid.NewGuid().ToString();
        public string GroupId { get; }
        public string Body { get; }
        public string Sender { get; }
        public DateTime Date { get; }
        public bool IsCareInstruction { get; }
        public bool IsAudio { get; }
        public bool IsImage { get; }
        public Stats Stats { get; }
    }
    public class Stats
    {
        public string PR { get; set; }
        public string TV { get; set; }
        public string PP { get; set; }
        public string IE { get; set; }
        public string MP { get; set; }
        public string O2 { get; set; }
    }
}

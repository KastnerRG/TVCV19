﻿using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TvCv19.Frontend.Domain.Models
{
    public class Message : IDbEntity
    {
        // needed for db
        public Message() { }
        public Message(string groupId, string message, Physician physician, DateTime date, bool isCareInstruction, bool isAudio, bool isImage, Stats stats, string recieverId, bool isEscalation)
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
            IsEscalation = isEscalation;
        }

        public string Id { get; set; } 
        [Required]
        public string GroupId { get; set; }
        [Required]
        public string Body { get; set; }
        [Required]
        public string Sender { get; set; }
        [NotMapped]
        public string ReceiverId { get; set; }
        public bool IsEscalation { get; set; }
        public DateTime Date { get; }
        public bool IsCareInstruction { get; }
        public bool IsAudio { get; set; }
        public bool IsImage { get; set; }
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

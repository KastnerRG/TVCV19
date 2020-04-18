﻿using System;
namespace TvCv19.Frontend.Domain.Models
{
    public class MessageDto
    {
        public MessageDto(string name, string message, DateTime date, string id, bool isCareInstructions, bool isAudio, bool isImage)
        {
            Name = name;
            Message = message;
            Date = date;
            Id = id;
            IsCareInstructions = isCareInstructions;
            IsAudio = isAudio;
            IsImage = isImage;
        }

        public string Name { get; set; }
        public string Message { get; set; }
        public DateTime Date { get; set; }
        public string Id { get; set; }
        public bool IsCareInstructions { get; }
        public bool IsAudio { get; }
        public bool IsImage { get; }
        public bool IsCareInstruction { get; set; }
    }
}

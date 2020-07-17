using System;
using System.Collections.Generic;
using System.Text;
using System.Text.Json.Serialization;

namespace TvCv19.DailyCo.Client.Models
{
    public class Room
    {
        [JsonPropertyName("api_created")]
        public bool? ApiCreated { get; set; }

        public RoomProperties Config { get; set; }

        [JsonPropertyName("created_at")]
        public DateTime? CreatedAt { get; set; }

        public string Name { get; set; }

        public string Privacy { get; set; }

        public string Url { get; set; }
    }

    public class RoomRequest {
        public string Name { get; set; }
        public RoomProperties Properties {get; set;}
    }
}

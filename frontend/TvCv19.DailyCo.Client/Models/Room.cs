using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Text;

namespace TvCv19.DailyCo.Client.Models
{
    public class Room
    {
        [JsonProperty(PropertyName = "api_created")]
        public bool? ApiCreated { get; set; }

        public RoomProperties Config { get; set; }

        [JsonProperty(PropertyName = "created_at")]
        public DateTime? CreatedAt { get; set; }

        public string Name { get; set; }

        public RoomPrivacy Privacy { get; set; }

        public string Url { get; set; }
    }
}

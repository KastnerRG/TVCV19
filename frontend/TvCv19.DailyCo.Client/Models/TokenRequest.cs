using System;
using System.Text.Json.Serialization;

namespace TvCv19.DailyCo.Client.Models
{
    public class TokenRequest
    {
        public TokenProperties Properties { get; set; }
    }

    public class TokenProperties
    {
        [JsonPropertyName("is_owner")]
        public bool IsOwner { get; set; }

        [JsonPropertyName("room_name")]
        public string RoomName { get; set; }
    }

    public class TokenResponse
    {
        public string Token { get; set; }
    }
 }

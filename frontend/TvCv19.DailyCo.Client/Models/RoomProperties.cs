using System;
using System.Collections.Generic;
using System.Text;
using System.Text.Json.Serialization;

namespace TvCv19.DailyCo.Client.Models
{
    public class RoomProperties
    {
        public bool? Autojoin { get; set; }

        [JsonPropertyName("eject_after_elapsed")]
        public int? EjectAfterElapsed { get; set; }

        [JsonPropertyName("eject_at_room_exp")]
        public bool? EjectAtRoomExpired { get; set; }

        [JsonPropertyName("enable_chat")]
        public bool? EnableChat { get; set; }

        [JsonPropertyName("enable_knocking")]
        public bool? EnableKnocking { get; set; }

        [JsonPropertyName("enable_recording")]
        public bool? EnableRecording { get; set; }

        [JsonPropertyName("enable_screenshare")]
        public bool? EnableScreenshare { get; set; }

        [JsonPropertyName("exp")]
        public long? Expires { get; set; }

        [JsonPropertyName("lang")]
        public Language Language { get; set; }

        [JsonPropertyName("max_participants")]
        public int? MaxParticipants { get; set; }

        [JsonPropertyName("nbf")]
        public long? NotBefore { get; set; }

        [JsonPropertyName("owner_only_broadcast")]
        public bool? OwnerOnlyBroadcast { get; set; }

        [JsonPropertyName("start_video_off")]
        public bool? StartVideoOff { get; set; }

        [JsonPropertyName("start_audio_off")]
        public bool? StartAudioOff { get; set; }
    }
}

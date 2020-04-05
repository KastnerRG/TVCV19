using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Text;

namespace TvCv19.DailyCo.Client.Models
{
    public class RoomProperties
    {
        public bool? Autojoin { get; set; }

        [JsonProperty(PropertyName = "eject_after_elapsed")]
        public int? EjectAfterElapsed { get; set; }

        [JsonProperty(PropertyName = "eject_at_room_exp")]
        public bool? EjectAtRoomExpired { get; set; }

        [JsonProperty(PropertyName = "enable_chat")]
        public bool? EnableChat { get; set; }

        [JsonProperty(PropertyName = "enable_knocking")]
        public bool? EnableKnocking { get; set; }

        [JsonProperty(PropertyName = "enable_recording")]
        public bool? EnableRecording { get; set; }

        [JsonProperty(PropertyName = "enable_screenshare")]
        public bool? EnableScreenshare { get; set; }

        [JsonProperty(PropertyName = "exp")]
        public long? Expires { get; set; }

        [JsonProperty(PropertyName = "lang")]
        public Language Language { get; set; }

        [JsonProperty(PropertyName = "max_participants")]
        public int? MaxParticipants { get; set; }

        [JsonProperty(PropertyName = "nbf")]
        public long? NotBefore { get; set; }

        [JsonProperty(PropertyName = "owner_only_broadcast")]
        public bool? OwnerOnlyBroadcast { get; set; }

        [JsonProperty(PropertyName = "start_video_off")]
        public bool? StartVideoOff { get; set; }

        [JsonProperty(PropertyName = "start_audio_off")]
        public bool? StartAudioOff { get; set; }
    }
}

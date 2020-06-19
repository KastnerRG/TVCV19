using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Threading.Tasks;
using System.Text.Json;
using TvCv19.DailyCo.Client.Models;

namespace TvCv19.DailyCo.Client
{
    public class RoomClient
    {
        private const string DAILY_URL = "https://api.daily.co/v1";
        private JsonSerializerOptions serializerOptions = new JsonSerializerOptions() { PropertyNamingPolicy = JsonNamingPolicy.CamelCase, IgnoreNullValues = true, PropertyNameCaseInsensitive = true };

        private class RoomList
        {
            public Room[] Data { get; set; }
        }

        private readonly HttpClient _httpClient;

        public RoomClient(HttpClient httpClient)
        {
            _httpClient = httpClient;
        }
        public async Task<string> CreateRoomAsync(RoomRequest room)
        {
            var content = new StringContent(JsonSerializer.Serialize(room, serializerOptions));
            var response = await _httpClient.PostAsync($"{DAILY_URL}/rooms", content);

            if (response.IsSuccessStatusCode)
            {
                var token = await CreateRoomTokenAsync(room.Name);
                return token;
            }

            return null;
        }

        private async Task<string> CreateRoomTokenAsync(string roomName)
        {

            var content = new StringContent(JsonSerializer.Serialize(new TokenRequest { Properties = new TokenProperties { IsOwner = true, RoomName = roomName } }, serializerOptions));
            var response = await _httpClient.PostAsync($"{DAILY_URL}/meeting-tokens", content);

            if (response.IsSuccessStatusCode)
            {
                var token = JsonSerializer.Deserialize<TokenResponse>(await response.Content.ReadAsStringAsync(), serializerOptions);
                return token.Token;
            }

            return null;

        }

        public async Task DeleteRoomAsync(string name)
        {
            var response = await _httpClient.DeleteAsync($"{DAILY_URL}/rooms/{name}");
            response.Dispose();
        }

        public Task DeleteRoomAsync(Room room) => DeleteRoomAsync(room.Name);

        public async Task<IEnumerable<Room>> GetRoomsAsync()
        {
            var response = await _httpClient.GetAsync($"{DAILY_URL}/rooms");
            return JsonSerializer.Deserialize<RoomList>(await response.Content.ReadAsStringAsync(), serializerOptions).Data;
        }

        public async Task<Room> GetRoomAsync(string name)
        {
            var response = await _httpClient.GetAsync($"{DAILY_URL}/rooms/{name}");
            return JsonSerializer.Deserialize<Room>(await response.Content.ReadAsStringAsync(), serializerOptions);
        }
    }
}

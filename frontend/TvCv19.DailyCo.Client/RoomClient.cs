using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;
using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using TvCv19.DailyCo.Client.Models;

namespace TvCv19.DailyCo.Client
{
    public class RoomClient : IDisposable
    {
        private const string DAILY_URL = "https://api.daily.co/v1";

        private class RoomList
        {
            public Room[] Data { get; set; }
        }

        private readonly HttpClient httpClient;

        static RoomClient()
        {
            JsonConvert.DefaultSettings = () =>
            {
                var serializerSettings = new JsonSerializerSettings
                {
                    ContractResolver = new CamelCasePropertyNamesContractResolver(),
                    NullValueHandling = NullValueHandling.Ignore
                };

                return serializerSettings;
            };

        }

        public RoomClient(string token)
        {
            httpClient = new HttpClient();
            httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);
        }

        public async Task<Room> CreateRoomAsync(Room room)
        {
            using (var content = new StringContent(JsonConvert.SerializeObject(room)))
            {
                using (var response = await httpClient.PostAsync($"{DAILY_URL}/rooms", content))
                {
                    if (response.IsSuccessStatusCode)
                    {
                        return JsonConvert.DeserializeObject<Room>(await response.Content.ReadAsStringAsync());
                    }

                    throw new Exception("Cannot create room");
                }
            }
        }

        public async Task DeleteRoomAsync(string name)
        {
            var response = await httpClient.DeleteAsync($"{DAILY_URL}/rooms/{name}");
            response.Dispose();
        }

        public Task DeleteRoomAsync(Room room) => DeleteRoomAsync(room.Name);

        public async Task<IEnumerable<Room>> GetRoomsAsync()
        {
            using (var response = await httpClient.GetAsync($"{DAILY_URL}/rooms"))
            {
                return JsonConvert.DeserializeObject<RoomList>(await response.Content.ReadAsStringAsync()).Data;
            }
        }

        public async Task<Room> GetRoomAsync(string name)
        {
            using (var response = await httpClient.GetAsync($"{DAILY_URL}/rooms/{name}"))
            {
                return JsonConvert.DeserializeObject<Room>(await response.Content.ReadAsStringAsync());
            }
        }

        public void Dispose()
        {
            httpClient.Dispose();
        }
    }
}

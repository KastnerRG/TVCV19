using Newtonsoft.Json;
using System;
using System.Net.Http;
using System.Threading.Tasks;
using TvCv19.DailyCo.Client.Models;

namespace TvCv19.DailyCo.Client
{
    public class RoomClient : IDisposable
    {
        private readonly HttpClient httpClient;
        private readonly string url;

        public RoomClient(string url, string token)
        {
            this.url = url;

            httpClient = new HttpClient();
            httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);
        }

        public async Task CreateAsync(Room room)
        {
            using (var content = new StringContent(JsonConvert.SerializeObject(room)))
            {
                using (var response = await httpClient.PostAsync($"{url}/rooms", content))
                {
                    if (!response.IsSuccessStatusCode)
                    {
                        throw new Exception("Cannot create room");
                    }
                }
            }
        }

        public async Task DeleteAsync(string name)
        {
            var response = await httpClient.DeleteAsync($"{url}/rooms/{name}");
            response.Dispose();
        }

        public Task DeleteAsync(Room room) => DeleteAsync(room.Name);

        public void Dispose()
        {
            httpClient.Dispose();
        }
    }
}

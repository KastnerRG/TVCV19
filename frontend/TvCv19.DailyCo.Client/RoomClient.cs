using Newtonsoft.Json;
using System;
using System.Net.Http;
using System.Threading.Tasks;
using TvCv19.DailyCo.Client.Models;

namespace TvCv19.DailyCo.Client
{
    public class RoomClient
    {
        private string url;

        public RoomClient(string url)
        {
            this.url = url;
        }

        public async Task<Room> CreateAsync(Room room)
        {
            using (var client = new HttpClient())
            {
                using (var content = new StringContent(JsonConvert.SerializeObject(room)))
                {
                    using (var response = await client.PostAsync($"{url}/rooms", content))
                    {
                        if (response.IsSuccessStatusCode)
                        {
                            return JsonConvert.DeserializeObject<Room>(await response.Content.ReadAsStringAsync());
                        }

                        throw new Exception("Cannot create room");
                    }
                }
            }
        }
    }
}

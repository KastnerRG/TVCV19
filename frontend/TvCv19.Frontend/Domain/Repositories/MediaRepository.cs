using Microsoft.Extensions.Configuration;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace TvCv19.Frontend.Domain.Repositories
{
    public class MediaRepository : IMediaRepository
    {
        public async Task<string> AddMedia(Media media)
        {
            using var context = new MedeccContext();

            var id = Guid.NewGuid().ToString().Replace("-", string.Empty);

            media.Id = id;
            await context.AddAsync(media);
            await context.SaveChangesAsync();

            return id;
        }

        public Task<Media> GetMedia(string id)
        {
            using var context = new MedeccContext();

            return Task.FromResult((from m in context.Media
                                    where m.Id == id
                                    select m).FirstOrDefault());
        }
    }
}
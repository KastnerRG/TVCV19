using Microsoft.Extensions.Configuration;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace TvCv19.Frontend.Domain.Repositories
{
    public class MediaRepository : IMediaRepository
    {
        public async Task<int> AddMedia(Media media)
        {
            using var context = new MedeccContext();

            var @return = await context.AddAsync(media);
            await context.SaveChangesAsync();

            return @return.Entity.Id;
        }

        public Task<Media> GetMedia(int id)
        {
            using var context = new MedeccContext();

            return Task.FromResult((from m in context.Media
                                    where m.Id == id
                                    select m).FirstOrDefault());
        }
    }
}
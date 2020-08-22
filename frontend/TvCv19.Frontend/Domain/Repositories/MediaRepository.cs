using System;
using System.Threading.Tasks;

namespace TvCv19.Frontend.Domain.Repositories
{
    public class MediaRepository : BaseRepository, IMediaRepository
    {
        public async Task<string> AddMedia(Media media)
        {
            var id = Guid.NewGuid().ToString().Replace("-", string.Empty);
            var sql = $@"INSERT INTO medecc.media
                         (id, file_name, file, mime_type)
                         VALUES ('{id}', @FileName, @File, @MimeType)";
            await ExecuteAsync<Media>(sql, media);
            return id;
        }

        public async Task<Media> GetMedia(string id)
        {
            var param = new { id };
            var sql = $@"SELECT id, file_name as fileName, file, mime_type as mimeType
                         FROM medecc.media
                         WHERE id = @id";
            return await GetFirstOrDefaultAsync<Media>(sql, param);
        }
    }
}
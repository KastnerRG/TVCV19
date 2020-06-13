using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Dapper;
using TvCv19.Frontend.Domain.Models;

namespace TvCv19.Frontend.Domain.Repositories
{
    public class MessageRepository : BaseRepository, IMessageRepository
    {
        public async Task<string> AddMessage(Message message)
        {
            message.Id = Guid.NewGuid().ToString().Replace("-", string.Empty);
            string statsId = null;

            if (message.Stats != null)
            {
                statsId = Guid.NewGuid().ToString().Replace("-", string.Empty);
                var statsSql = @$"INSERT INTO medecc.stats
                                  (id, PR, TV, PP, IE, MP, O2)
                                  VALUES ('{statsId}', @PR, @TV, @PP, @IE, @MP, @O2)";
                await ExecuteAsync<Stats>(statsSql, message.Stats);
            }

            var sql = @$"INSERT INTO medecc.message
                        (id, group_id, body, sender, date, is_care_instruction, is_audio, is_image, is_escalation, stats_id)
                        VALUES (@Id, @GroupId, @Body, @Sender, @Date, @IsCareInstruction, @IsAudio, @IsImage, @IsEscalation, '{statsId}' )";
            await ExecuteAsync<Message>(sql, message);
            return message.Id;
        }

        public async Task<IEnumerable<Message>> GetMessagesByGroup(string groupId)
        {
            var messageSql = $@"SELECT message.id as id, group_id as groupId, body, sender, date, is_care_instruction as isCareInstruction, is_audio as isAudio, is_image as isImage, is_escalation as isEscalation, message.stats_id,
                                stats.id, stats.PR, stats.TV, stats.PP, stats.IE, stats.MP, stats.O2
                                FROM medecc.message as message
                                LEFT JOIN medecc.stats as stats ON message.stats_id = stats.id
                                WHERE message.group_id = '{groupId}'
                                ORDER BY date";
            using var connection = GetConnection();
            await connection.OpenAsync();
            var messages = await connection.QueryAsync<Message, Stats, Message>(messageSql,
                 (message, stats) =>
                 {
                     if (string.IsNullOrEmpty(stats.Id))
                     {
                         return message;
                     }
                     message.Stats = stats;
                     return message;
                 }
                 , splitOn: "stats_id"
                 );
            return messages;
        }
    }
}

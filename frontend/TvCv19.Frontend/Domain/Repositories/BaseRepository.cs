using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Dapper;
using MySql.Data.MySqlClient;
using TvCv19.Frontend.Domain.Models;

namespace TvCv19.Frontend.Domain
{

    public class BaseRepository
    {
        private string _connectionString = "Server=localhost;Database=medecc;Uid=root;Pwd=Password1;";

        public MySqlConnection GetConnection()
        {
            return new MySqlConnection(_connectionString);
        }

        public async Task ExecuteAsync<T>(string sql, object param) where T : IDbEntity
        {
            using var connection = GetConnection();
            await connection.OpenAsync();
            await connection.QueryAsync<T>(sql, param);
        }

        public async Task<IEnumerable<T>> GetAsync<T>(string sql, object param) where T : IDbEntity
        {
            using var connection = GetConnection();
            await connection.OpenAsync();
            return await connection.QueryAsync<T>(sql, param);

        }

        public async Task<T> GetFirstOrDefaultAsync<T>(string sql, object param) where T : IDbEntity
        {
            using var connection = GetConnection();

            await connection.OpenAsync();
            return await connection.QueryFirstOrDefaultAsync<T>(sql, param);

        }


    }


}
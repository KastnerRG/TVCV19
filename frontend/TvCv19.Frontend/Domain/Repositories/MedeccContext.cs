using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using MySql.Data.MySqlClient;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TvCv19.Frontend.Domain.Models;

namespace TvCv19.Frontend.Domain.Repositories
{
    public class MedeccContext : DbContext
    {
        private const string _connectionString = "Server=localhost;Database=medecc;Uid=root;Pwd=Password1;";

        public DbSet<ApplicationLogin> ApplicationLogins { get; set; }

        public DbSet<ApplicationRole> ApplicationRoles { get; set; }

        public DbSet<ApplicationLoginRole> ApplicationLoginRoles { get; set; }

        public DbSet<Physician> Caregivers { get; set; }

        public DbSet<Media> Media { get; set; }

        public DbSet<Message> Messages { get; set; }

        public DbSet<Notification> Notifications { get; set; }

        public DbSet<Patient> Patients { get; set; }

        public DbSet<Stats> Stats { get; set; }

        // Note that for migrations to work, this class must have a parameterless constructor.

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<ApplicationLogin>().Property(p => p.NormalizedUserName).IsRequired();

            modelBuilder.Entity<ApplicationRole>().Property(p => p.NormalizedName).IsRequired();

            modelBuilder.Entity<Media>().Property(p => p.File).HasColumnType("longblob");

            modelBuilder.Entity<Physician>().Property(p => p.SupervisorId).IsRequired(false);

            modelBuilder.Entity<ApplicationLoginRole>().HasKey(lr => new { lr.ApplicationLoginId, lr.ApplicationRoleId });
            modelBuilder.Entity<ApplicationLoginRole>()
                .HasOne(lr => lr.ApplicationLogin)
                .WithMany(l => l.LoginRoles)
                .HasForeignKey(lr => lr.ApplicationLoginId);
            modelBuilder.Entity<ApplicationLoginRole>()
                .HasOne(lr => lr.ApplicationRole)
                .WithMany(r => r.LoginRoles)
                .HasForeignKey(lr => lr.ApplicationRoleId);

            try
            {
                // Necessary to work around a bug with MySql Entity Framework.
                using var connection = new MySqlConnection(_connectionString);
                connection.Open();

                using var command = connection.CreateCommand();

                command.CommandText = "ALTER TABLE Caregivers MODIFY `SupervisorId` int NULL;";
                command.ExecuteNonQuery();

                command.CommandText = "ALTER TABLE Patients MODIFY `CaregiverId` int NULL;";
                command.ExecuteNonQuery();
            }
            catch (Exception)
            {
                // Skip
            }
        }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder) =>
            optionsBuilder.UseMySQL(_connectionString);
    }
}

using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
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

        public DbSet<Physician> Caregivers { get; set; }

        public DbSet<Media> Media { get; set; }

        public DbSet<Message> Messages { get; set; }

        public DbSet<Notification> Notifications { get; set; }

        public DbSet<Patient> Patients { get; set; }

        public DbSet<Stats> Stats { get; set; }

        // Note that for migrations to work, this class must have a parameterless constructor.

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Media>().Property(p => p.File).HasColumnType("longblob");

            modelBuilder.Entity<Patient>().Property(p => p.CaregiverId).IsRequired();
        }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder) =>
            optionsBuilder.UseMySQL(_connectionString);
    }
}

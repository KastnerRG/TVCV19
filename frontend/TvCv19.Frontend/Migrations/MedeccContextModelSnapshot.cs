﻿// <auto-generated />
using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using TvCv19.Frontend.Domain.Repositories;

namespace TvCv19.Frontend.Migrations
{
    [DbContext(typeof(MedeccContext))]
    partial class MedeccContextModelSnapshot : ModelSnapshot
    {
        protected override void BuildModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "3.1.6")
                .HasAnnotation("Relational:MaxIdentifierLength", 64);

            modelBuilder.Entity("TvCv19.Frontend.Domain.Models.ApplicationLogin", b =>
                {
                    b.Property<string>("Id")
                        .HasColumnType("varchar(767)");

                    b.Property<bool?>("Enabled")
                        .IsRequired()
                        .HasColumnType("bit");

                    b.Property<string>("NormalizedUserName")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("PasswordHash")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("UserName")
                        .IsRequired()
                        .HasColumnType("text");

                    b.HasKey("Id");

                    b.ToTable("ApplicationLogins");
                });

            modelBuilder.Entity("TvCv19.Frontend.Domain.Models.Message", b =>
                {
                    b.Property<string>("Id")
                        .HasColumnType("varchar(767)");

                    b.Property<string>("Body")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("GroupId")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<bool>("IsAudio")
                        .HasColumnType("bit");

                    b.Property<bool>("IsEscalation")
                        .HasColumnType("bit");

                    b.Property<bool>("IsImage")
                        .HasColumnType("bit");

                    b.Property<string>("Sender")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("StatsId")
                        .HasColumnType("varchar(767)");

                    b.HasKey("Id");

                    b.HasIndex("StatsId");

                    b.ToTable("Messages");
                });

            modelBuilder.Entity("TvCv19.Frontend.Domain.Models.Stats", b =>
                {
                    b.Property<string>("Id")
                        .HasColumnType("varchar(767)");

                    b.Property<string>("IE")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("MP")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("O2")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("PP")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("PR")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("TV")
                        .IsRequired()
                        .HasColumnType("text");

                    b.HasKey("Id");

                    b.ToTable("Stats");
                });

            modelBuilder.Entity("TvCv19.Frontend.Domain.Notification", b =>
                {
                    b.Property<string>("Id")
                        .HasColumnType("varchar(767)");

                    b.Property<DateTime?>("Date")
                        .HasColumnType("datetime");

                    b.Property<bool>("IsEscalation")
                        .HasColumnType("bit");

                    b.Property<string>("Link")
                        .HasColumnType("text");

                    b.Property<string>("PatientId")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("RecieverId")
                        .IsRequired()
                        .HasColumnType("text");

                    b.HasKey("Id");

                    b.ToTable("Notifications");
                });

            modelBuilder.Entity("TvCv19.Frontend.Domain.Patient", b =>
                {
                    b.Property<string>("Id")
                        .HasColumnType("varchar(767)");

                    b.Property<int>("AdmissionStatus")
                        .HasColumnType("int");

                    b.Property<string>("CaregiverId")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<int>("EscalationLevel")
                        .HasColumnType("int");

                    b.Property<string>("Location")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("Token")
                        .HasColumnType("text");

                    b.HasKey("Id");

                    b.ToTable("Patients");
                });

            modelBuilder.Entity("TvCv19.Frontend.Domain.Physician", b =>
                {
                    b.Property<string>("Id")
                        .HasColumnType("varchar(767)");

                    b.Property<int>("Hierarchy")
                        .HasColumnType("int");

                    b.Property<string>("Location")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("SupervisorId")
                        .HasColumnType("text");

                    b.HasKey("Id");

                    b.ToTable("Caregivers");
                });

            modelBuilder.Entity("TvCv19.Frontend.Domain.Repositories.Media", b =>
                {
                    b.Property<string>("Id")
                        .HasColumnType("varchar(767)");

                    b.Property<byte[]>("File")
                        .IsRequired()
                        .HasColumnType("longblob");

                    b.Property<string>("FileName")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("MimeType")
                        .IsRequired()
                        .HasColumnType("text");

                    b.HasKey("Id");

                    b.ToTable("Media");
                });

            modelBuilder.Entity("TvCv19.Frontend.Domain.Models.Message", b =>
                {
                    b.HasOne("TvCv19.Frontend.Domain.Models.Stats", "Stats")
                        .WithMany()
                        .HasForeignKey("StatsId");
                });
#pragma warning restore 612, 618
        }
    }
}

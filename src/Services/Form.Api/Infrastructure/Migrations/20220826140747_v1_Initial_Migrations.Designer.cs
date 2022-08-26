﻿// <auto-generated />
using System;
using Form.Api.Infrastructure;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

#nullable disable

namespace Form.Api.Infrastructure.Migrations
{
    [DbContext(typeof(FormContext))]
    [Migration("20220826140747_v1_Initial_Migrations")]
    partial class v1_Initial_Migrations
    {
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "6.0.4")
                .HasAnnotation("Relational:MaxIdentifierLength", 128);

            SqlServerModelBuilderExtensions.UseIdentityColumns(modelBuilder, 1L, 1);

            modelBuilder.HasSequence("Form_User_Hilo")
                .IncrementsBy(10);

            modelBuilder.HasSequence("register_hilo")
                .IncrementsBy(10);

            modelBuilder.HasSequence("Token_Price_Hilo")
                .IncrementsBy(10);

            modelBuilder.Entity("Form.Api.Models.FormUser", b =>
                {
                    b.Property<int>("FormUserId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseHiLo(b.Property<int>("FormUserId"), "Form_User_Hilo");

                    b.Property<decimal?>("ApprovedPrice")
                        .HasColumnType("decimal(18,2)");

                    b.Property<DateTime>("CreateDate")
                        .HasColumnType("datetime2");

                    b.Property<string>("FromStatus")
                        .IsRequired()
                        .HasColumnType("varchar(50)");

                    b.Property<DateTime?>("LastUpdateDate")
                        .HasColumnType("datetime2");

                    b.Property<string>("Network")
                        .IsRequired()
                        .HasColumnType("varchar(50)");

                    b.Property<string>("RegisterUserId")
                        .IsRequired()
                        .HasColumnType("varchar(100)");

                    b.Property<string>("TransactionId")
                        .IsRequired()
                        .HasColumnType("varchar(500)");

                    b.Property<string>("TransactionImage")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("TransactionNote")
                        .HasColumnType("varchar(500)");

                    b.HasKey("FormUserId");

                    b.ToTable("FormUser", (string)null);
                });

            modelBuilder.Entity("Form.Api.Models.RegisterUser", b =>
                {
                    b.Property<int>("RegisterUserId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseHiLo(b.Property<int>("RegisterUserId"), "register_hilo");

                    b.Property<DateTime>("CreateDate")
                        .HasColumnType("datetime2");

                    b.Property<string>("EmailAdress")
                        .IsRequired()
                        .HasColumnType("varchar(50)");

                    b.Property<string>("FirstName")
                        .IsRequired()
                        .HasColumnType("varchar(50)");

                    b.Property<string>("LastName")
                        .IsRequired()
                        .HasColumnType("varchar(50)");

                    b.Property<DateTime?>("LastUpdateDate")
                        .HasColumnType("datetime2");

                    b.Property<string>("PhoneNumber")
                        .IsRequired()
                        .HasColumnType("varchar(50)");

                    b.Property<string>("WalletAdress")
                        .IsRequired()
                        .HasColumnType("varchar(50)");

                    b.Property<string>("WalletProvider")
                        .IsRequired()
                        .HasColumnType("varchar(50)");

                    b.HasKey("RegisterUserId");

                    b.ToTable("RegisterUser", (string)null);
                });

            modelBuilder.Entity("Form.Api.Models.TokenPrice", b =>
                {
                    b.Property<int>("TokenPriceId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseHiLo(b.Property<int>("TokenPriceId"), "Token_Price_Hilo");

                    b.Property<DateTime>("CreateDate")
                        .HasColumnType("datetime2");

                    b.Property<DateTime?>("LastUpdateDate")
                        .HasColumnType("datetime2");

                    b.Property<decimal>("TokenPriceAmount")
                        .HasColumnType("decimal(18,2)");

                    b.Property<string>("TokenPriceCode")
                        .IsRequired()
                        .HasColumnType("varchar(50)");

                    b.HasKey("TokenPriceId");

                    b.ToTable("TokenPrice", (string)null);
                });
#pragma warning restore 612, 618
        }
    }
}

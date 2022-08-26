using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Form.Api.Infrastructure.Migrations
{
    public partial class v1_Initial_Migrations : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateSequence(
                name: "Form_User_Hilo",
                incrementBy: 10);

            migrationBuilder.CreateSequence(
                name: "register_hilo",
                incrementBy: 10);

            migrationBuilder.CreateSequence(
                name: "Token_Price_Hilo",
                incrementBy: 10);

            migrationBuilder.CreateTable(
                name: "FormUser",
                columns: table => new
                {
                    FormUserId = table.Column<int>(type: "int", nullable: false),
                    RegisterUserId = table.Column<string>(type: "varchar(100)", nullable: false),
                    TransactionId = table.Column<string>(type: "varchar(500)", nullable: false),
                    TransactionImage = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ApprovedPrice = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    TransactionNote = table.Column<string>(type: "varchar(500)", nullable: true),
                    Network = table.Column<string>(type: "varchar(50)", nullable: false),
                    FromStatus = table.Column<string>(type: "varchar(50)", nullable: false),
                    CreateDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    LastUpdateDate = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_FormUser", x => x.FormUserId);
                });

            migrationBuilder.CreateTable(
                name: "RegisterUser",
                columns: table => new
                {
                    RegisterUserId = table.Column<int>(type: "int", nullable: false),
                    FirstName = table.Column<string>(type: "varchar(50)", nullable: false),
                    LastName = table.Column<string>(type: "varchar(50)", nullable: false),
                    EmailAdress = table.Column<string>(type: "varchar(50)", nullable: false),
                    PhoneNumber = table.Column<string>(type: "varchar(50)", nullable: false),
                    WalletAdress = table.Column<string>(type: "varchar(50)", nullable: false),
                    WalletProvider = table.Column<string>(type: "varchar(50)", nullable: false),
                    CreateDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    LastUpdateDate = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RegisterUser", x => x.RegisterUserId);
                });

            migrationBuilder.CreateTable(
                name: "TokenPrice",
                columns: table => new
                {
                    TokenPriceId = table.Column<int>(type: "int", nullable: false),
                    TokenPriceCode = table.Column<string>(type: "varchar(50)", nullable: false),
                    TokenPriceAmount = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    CreateDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    LastUpdateDate = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TokenPrice", x => x.TokenPriceId);
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "FormUser");

            migrationBuilder.DropTable(
                name: "RegisterUser");

            migrationBuilder.DropTable(
                name: "TokenPrice");

            migrationBuilder.DropSequence(
                name: "Form_User_Hilo");

            migrationBuilder.DropSequence(
                name: "register_hilo");

            migrationBuilder.DropSequence(
                name: "Token_Price_Hilo");
        }
    }
}

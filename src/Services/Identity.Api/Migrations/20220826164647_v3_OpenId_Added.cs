using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Identity.Api.Migrations
{
    public partial class v3_OpenId_Added : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(@"
                INSERT INTO IdentityDb.[Identity].ClientScope (Scope, ClientId) VALUES (N'openid', 1)
            
            ");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {

        }
    }
}

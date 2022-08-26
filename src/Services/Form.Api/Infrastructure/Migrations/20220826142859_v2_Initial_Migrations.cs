using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Form.Api.Infrastructure.Migrations
{
    public partial class v2_Initial_Migrations : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(@"
              
            use IdentityDb
            INSERT INTO IdentityDb.[Identity].ClientScope (Scope, ClientId) VALUES (N'openid', 1)
            
            ");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {

        }
    }
}

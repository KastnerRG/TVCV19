using Microsoft.EntityFrameworkCore.Migrations;

namespace TvCv19.Frontend.Migrations
{
    public partial class ApplicationRole : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "ApplicationRoles",
                columns: table => new
                {
                    Id = table.Column<string>(nullable: false),
                    Name = table.Column<string>(nullable: false),
                    NormalizedName = table.Column<string>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ApplicationRoles", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "ApplicationLoginRoles",
                columns: table => new
                {
                    Id = table.Column<string>(nullable: false),
                    ApplicationLoginId = table.Column<string>(nullable: false),
                    ApplicationRoleId = table.Column<string>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ApplicationLoginRoles", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ApplicationLoginRoles_ApplicationLogins_ApplicationLoginId",
                        column: x => x.ApplicationLoginId,
                        principalTable: "ApplicationLogins",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ApplicationLoginRoles_ApplicationRoles_ApplicationRoleId",
                        column: x => x.ApplicationRoleId,
                        principalTable: "ApplicationRoles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ApplicationLoginRoles_ApplicationLoginId",
                table: "ApplicationLoginRoles",
                column: "ApplicationLoginId");

            migrationBuilder.CreateIndex(
                name: "IX_ApplicationLoginRoles_ApplicationRoleId",
                table: "ApplicationLoginRoles",
                column: "ApplicationRoleId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ApplicationLoginRoles");

            migrationBuilder.DropTable(
                name: "ApplicationRoles");
        }
    }
}

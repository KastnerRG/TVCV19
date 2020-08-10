using Microsoft.EntityFrameworkCore.Migrations;

namespace TvCv19.Frontend.Migrations
{
    public partial class PhysicianLogin : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "ApplicationLoginId",
                table: "Caregivers",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Caregivers_ApplicationLoginId",
                table: "Caregivers",
                column: "ApplicationLoginId");

            migrationBuilder.AddForeignKey(
                name: "FK_Caregivers_ApplicationLogins_ApplicationLoginId",
                table: "Caregivers",
                column: "ApplicationLoginId",
                principalTable: "ApplicationLogins",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Caregivers_ApplicationLogins_ApplicationLoginId",
                table: "Caregivers");

            migrationBuilder.DropIndex(
                name: "IX_Caregivers_ApplicationLoginId",
                table: "Caregivers");

            migrationBuilder.DropColumn(
                name: "ApplicationLoginId",
                table: "Caregivers");
        }
    }
}

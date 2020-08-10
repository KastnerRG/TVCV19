using Microsoft.EntityFrameworkCore.Migrations;

namespace TvCv19.Frontend.Migrations
{
    public partial class SupervisorNullable : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Caregivers_ApplicationLogins_ApplicationLoginId",
                table: "Caregivers");

            migrationBuilder.AlterColumn<int>(
                name: "SupervisorId",
                table: "Caregivers",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AlterColumn<int>(
                name: "ApplicationLoginId",
                table: "Caregivers",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Caregivers_ApplicationLogins_ApplicationLoginId",
                table: "Caregivers",
                column: "ApplicationLoginId",
                principalTable: "ApplicationLogins",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Caregivers_ApplicationLogins_ApplicationLoginId",
                table: "Caregivers");

            migrationBuilder.AlterColumn<int>(
                name: "SupervisorId",
                table: "Caregivers",
                type: "int",
                nullable: false,
                oldClrType: typeof(int),
                oldNullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "ApplicationLoginId",
                table: "Caregivers",
                type: "int",
                nullable: true,
                oldClrType: typeof(int));

            migrationBuilder.AddForeignKey(
                name: "FK_Caregivers_ApplicationLogins_ApplicationLoginId",
                table: "Caregivers",
                column: "ApplicationLoginId",
                principalTable: "ApplicationLogins",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}

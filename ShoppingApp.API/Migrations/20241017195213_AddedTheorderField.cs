using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ShoppingApp.API.Migrations
{
    /// <inheritdoc />
    public partial class AddedTheorderField : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "UsersId",
                table: "Orders",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Orders_UsersId",
                table: "Orders",
                column: "UsersId");

            migrationBuilder.AddForeignKey(
                name: "FK_Orders_Users_UsersId",
                table: "Orders",
                column: "UsersId",
                principalTable: "Users",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Orders_Users_UsersId",
                table: "Orders");

            migrationBuilder.DropIndex(
                name: "IX_Orders_UsersId",
                table: "Orders");

            migrationBuilder.DropColumn(
                name: "UsersId",
                table: "Orders");
        }
    }
}

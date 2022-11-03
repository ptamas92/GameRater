using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace GameRater.Repo.Migrations
{
    public partial class RenameForeignKeys : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Rating_AspNetUsers_UserId",
                table: "Rating");

            migrationBuilder.DropForeignKey(
                name: "FK_Rating_VideoGame_VideoGameId",
                table: "Rating");

            migrationBuilder.DropForeignKey(
                name: "FK_VideoGame_Publisher_PublisherId",
                table: "VideoGame");

            migrationBuilder.RenameColumn(
                name: "PublisherId",
                table: "VideoGame",
                newName: "PublisherFK");

            migrationBuilder.RenameIndex(
                name: "IX_VideoGame_PublisherId",
                table: "VideoGame",
                newName: "IX_VideoGame_PublisherFK");

            migrationBuilder.RenameColumn(
                name: "VideoGameId",
                table: "Rating",
                newName: "VideoGameFK");

            migrationBuilder.RenameColumn(
                name: "UserId",
                table: "Rating",
                newName: "UserFK");

            migrationBuilder.RenameIndex(
                name: "IX_Rating_VideoGameId",
                table: "Rating",
                newName: "IX_Rating_VideoGameFK");

            migrationBuilder.AddForeignKey(
                name: "FK_Rating_AspNetUsers_UserFK",
                table: "Rating",
                column: "UserFK",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Rating_VideoGame_VideoGameFK",
                table: "Rating",
                column: "VideoGameFK",
                principalTable: "VideoGame",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_VideoGame_Publisher_PublisherFK",
                table: "VideoGame",
                column: "PublisherFK",
                principalTable: "Publisher",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Rating_AspNetUsers_UserFK",
                table: "Rating");

            migrationBuilder.DropForeignKey(
                name: "FK_Rating_VideoGame_VideoGameFK",
                table: "Rating");

            migrationBuilder.DropForeignKey(
                name: "FK_VideoGame_Publisher_PublisherFK",
                table: "VideoGame");

            migrationBuilder.RenameColumn(
                name: "PublisherFK",
                table: "VideoGame",
                newName: "PublisherId");

            migrationBuilder.RenameIndex(
                name: "IX_VideoGame_PublisherFK",
                table: "VideoGame",
                newName: "IX_VideoGame_PublisherId");

            migrationBuilder.RenameColumn(
                name: "VideoGameFK",
                table: "Rating",
                newName: "VideoGameId");

            migrationBuilder.RenameColumn(
                name: "UserFK",
                table: "Rating",
                newName: "UserId");

            migrationBuilder.RenameIndex(
                name: "IX_Rating_VideoGameFK",
                table: "Rating",
                newName: "IX_Rating_VideoGameId");

            migrationBuilder.AddForeignKey(
                name: "FK_Rating_AspNetUsers_UserId",
                table: "Rating",
                column: "UserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Rating_VideoGame_VideoGameId",
                table: "Rating",
                column: "VideoGameId",
                principalTable: "VideoGame",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_VideoGame_Publisher_PublisherId",
                table: "VideoGame",
                column: "PublisherId",
                principalTable: "Publisher",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}

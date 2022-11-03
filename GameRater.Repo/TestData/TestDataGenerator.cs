using GameRater.Data;
using Microsoft.EntityFrameworkCore;
using System.Text;

namespace GameRater.Repo.TestData
{
    public class TestDataGenerator
    {
        public static void Execute(ModelBuilder modelBuilder)
        {
            var vgId = 100000;
            var rand = new Random();

            var ratings = new List<Rating>();
            var videoGames = new List<VideoGame>();

            for (int i = 0; i < 100; i++)
            {
                videoGames.Add(new VideoGame()
                {
                    Id = vgId,
                    PublisherId = rand.Next(0, 2) == 0 ? 100000 : 100001,
                    Title = $"Test video game {i}",
                    Description = GenerateDescription(rand.Next(0, 1000)),
                    YearOfPublication = 2022 - rand.Next(0, 15),
                    CoverImageUrl = "https://picsum.photos/200/300"
                });

                if (i % 8 == 0)
                {
                    ratings.Add(new Rating()
                    {
                        VideoGameId = vgId,
                        UserId = "911acbed-4f1a-4eee-a0ce-4359c0b57eb6",
                        Value = rand.Next(1, 10)
                    });
                }

                vgId++;
            }

            /********************************************************************************************************/

            modelBuilder.Entity<User>().HasData
            (
                new User()
                {
                    Id = "911acbed-4f1a-4eee-a0ce-4359c0b57eb6",
                    UserName = "test@email.com",
                    NormalizedUserName = "TEST@EMAIL.COM",
                    Email = "test@email.com",
                    NormalizedEmail = "TEST@EMAIL.COM",
                    EmailConfirmed = true,
                    PasswordHash = "AQAAAAEAACcQAAAAEJwKhAD+QVnmr/mNbqoRZt7MOwjjwVm4+pcEb0PLwAitqXECuGwgpE6ACX2ECPSvAw==",
                    SecurityStamp = "JV7HVDHPKOXMGSSBBTUPUDTJNUMQIO2B",
                    ConcurrencyStamp = "0af53b39-0a5c-4ce6-8695-36df5d6958ed",
                    PhoneNumber = null,
                    PhoneNumberConfirmed = false,
                    TwoFactorEnabled = false,
                    LockoutEnabled = false,
                    LockoutEnd = null,
                    AccessFailedCount = 0
                }
            );

            modelBuilder.Entity<Publisher>().HasData
            (
                new Publisher()
                {
                    Id = 100000,
                    Name = "Test publisher 1"
                },
                new Publisher()
                {
                    Id = 100001,
                    Name = "Test publisher 2"
                }
            );

            modelBuilder.Entity<VideoGame>().HasData(videoGames);
            modelBuilder.Entity<Rating>().HasData(ratings);
        }

        private static string GenerateDescription(int length)
        {
            char ch;
            var random = new Random();
            var builder = new StringBuilder();
            var legalCharacters = " abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

            for (int i = 0; i < length; i++)
            {
                ch = legalCharacters[random.Next(0, legalCharacters.Length)];
                builder.Append(ch);
            }

            return builder.ToString().ToLower();
        }
    }
}

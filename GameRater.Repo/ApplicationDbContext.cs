using GameRater.Data;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace GameRater.Repo
{
    public class ApplicationDbContext : IdentityDbContext<User>
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base (options)
        {
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Publisher>().HasMany(g => g.VideoGames)
                                            .WithOne(s => s.Publisher)
                                            .HasForeignKey(s => s.PublisherId)
                                            .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Rating>().HasKey(sc => new { sc.UserId, sc.VideoGameId });
        }

        public DbSet<VideoGame> VideoGame { get; set; }
        public DbSet<Publisher> Publisher { get; set; }
        public DbSet<Rating> Rating { get; set; }
    }
}
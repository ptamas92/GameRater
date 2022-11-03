using System.ComponentModel.DataAnnotations.Schema;

namespace GameRater.Data
{
    [Table("Rating")]
    public class Rating
    {
        [Column("VideoGameFK")]
        public int VideoGameId { get; set; }

        [ForeignKey("VideoGameId")]
        public VideoGame VideoGame { get; set; }

        [Column("UserFK")]
        public string UserId { get; set; }

        [ForeignKey("UserId")]
        public User User { get; set; }

        public int Value { get; set; }
    }
}

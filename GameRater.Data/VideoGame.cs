using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace GameRater.Data
{
    [Table("VideoGame")]
    public class VideoGame
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [MaxLength(100)]
        public string Title { get; set; }

        [MaxLength(1000)]
        public string Description { get; set; }

        [Required]
        public int YearOfPublication { get; set; }

        public string CoverImageUrl { get; set; }

        [Column("PublisherFK")]
        public int PublisherId { get; set; }

        [Required]
        [ForeignKey("PublisherId")]
        public virtual Publisher Publisher { get; set; }

        public virtual IList<Rating> Ratings { get; set; } = new List<Rating>();
    }
}

using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace GameRater.Data
{
    [Table("Publisher")]
    public class Publisher
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string Name { get; set; }

        public virtual IList<VideoGame> VideoGames { get; set; } = new List<VideoGame>();
    }
}

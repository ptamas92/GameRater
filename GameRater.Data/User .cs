using Microsoft.AspNetCore.Identity;

namespace GameRater.Data
{
    public class User : IdentityUser
    {
        public virtual IList<Rating> Ratings { get; set; } = new List<Rating>();
    }
}
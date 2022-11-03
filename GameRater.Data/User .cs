using Microsoft.AspNetCore.Identity;

namespace GameRater.Data
{
    public class User : IdentityUser
    {
        public IList<Rating> Ratings { get; set; } = new List<Rating>();
    }
}
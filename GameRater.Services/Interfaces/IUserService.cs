using GameRater.Data;

namespace GameRater.Services.Interfaces
{
    public interface IUserService : IRepositoryService<User>
    {
        User GetByUsername(string username);

        User GetByEmail(string email);

        string GetCurrentUserId();

        User GetCurrentUser();
    }
}

using GameRater.Data;
using GameRater.Repo;
using GameRater.Services.Interfaces;
using Microsoft.AspNetCore.Http;
using System.Linq.Expressions;
using System.Security.Claims;
using GameRater.Repo.Repository;

namespace GameRater.Services
{
    public class UserService : IUserService
    {
        private readonly IHttpContextAccessor httpContextAccessor;
        private readonly ApplicationDbContext dbContext;
        private readonly IRepository<ApplicationDbContext, User> userRepo;

        public UserService(IHttpContextAccessor httpContextAccessor, ApplicationDbContext dbContext, IRepository<ApplicationDbContext, User> userRepo)
        {
            this.httpContextAccessor = httpContextAccessor;
            this.dbContext = dbContext;
            this.userRepo = userRepo;
        }


        //Get
        public IEnumerable<User> Get(Expression<Func<User, bool>> filter = null, Func<IQueryable<User>, IOrderedQueryable<User>> orderBy = null, string includeProperties = "")
        {
            return userRepo.Get(filter, orderBy, includeProperties);
        }

        //GetAll
        public IEnumerable<User> GetAll()
        {
            return dbContext.Users;
        }

        //GetById
        public User GetById(object id)
        {
            return GetAll().FirstOrDefault(x => x.Id == (string)id);
        }

        //GetByUsername
        public User GetByUsername(string username)
        {
            return dbContext.Users.FirstOrDefault(x => x.UserName == username);
        }

        //GetByEmail
        public User GetByEmail(string email)
        {
            return dbContext.Users.ToList().FirstOrDefault(x => x.Email == email);
        }

        //GetCurrentUser
        public string GetCurrentUserId()
        {
            var userIdAsString = httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (!string.IsNullOrEmpty(userIdAsString))
                return userIdAsString;

            return null;
        }

        //GetCurrentUser
        public User GetCurrentUser()
        {
            var userId = GetCurrentUserId();

            if (!string.IsNullOrEmpty(userId))
                return dbContext.Users.FirstOrDefault(x => x.Id == userId);

            return null;
        }

        //Insert
        public void Insert(User user)
        {
            userRepo.Insert(user);
        }

        //Update
        public void Update(User user)
        {
            userRepo.Update(user);
        }

        //Delete
        public void Delete(User user)
        {
            userRepo.Delete(user);
        }

        //Delete
        public void Delete(object id)
        {
            userRepo.Delete(id);
        }
    }
}

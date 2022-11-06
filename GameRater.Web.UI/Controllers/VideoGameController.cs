using GameRater.Data;
using GameRater.Repo;
using GameRater.Repo.Repository;
using GameRater.Services.Interfaces;
using GameRater.Web.UI.Models.Common;
using GameRater.Web.UI.Models.VideoGame;
using GameRater.Web.UI.Utils;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Linq.Expressions;

namespace GameRater.Web.UI.Controllers
{
    public class VideoGameController : Controller
    {
        private readonly AppConfig appConfig;
        private readonly IUserService userService;
        private readonly IRepository<ApplicationDbContext, Rating> ratingRepo;
        private readonly IRepository<ApplicationDbContext, VideoGame> videoGameRepo;

        public VideoGameController(AppConfig appConfig,
                                   IUserService userService,
                                   IRepository<ApplicationDbContext, Rating> ratingRepo,
                                   IRepository<ApplicationDbContext, VideoGame> videoGameRepo)
        {
            this.appConfig = appConfig;
            this.userService = userService;
            this.ratingRepo = ratingRepo;
            this.videoGameRepo = videoGameRepo;
        }

        /*************************************************************************************************************************************************************/

        [HttpGet]
        public IActionResult GetVideoGames(GetVideoGameRequestModel model)
        {
            var res = new GetVideoGameResponseModel();
            var isAuthenticated = HttpContext.User.Identity?.IsAuthenticated ?? false;

            Expression<Func<VideoGame, bool>>? filter = null;

            if (isAuthenticated && model.IsFilter)
            {
                var userId = userService.GetCurrentUserId();
                filter = (x => x.Ratings.Any(x => x.UserId == userId));
            }

            var ratingDict = ratingRepo.Get().GroupBy(x => x.VideoGameId).ToDictionary(x => x.Key, x => x.Average(y => y.Value));

            var dataSource = videoGameRepo.Get(filter, x => x.Include(s => s.Publisher)
                                                             .Skip(model.DataSourceLength)
                                                             .Take(appConfig.SizePerPage * 4)
                                                             .OrderBy(x => x.Title))
                                                             .Select(x => new VideoGameListItemModel()
                                                             {
                                                                 Id = x.Id,
                                                                 Title = x.Title,
                                                                 Description = x.Description,
                                                                 YearOfPublication = x.YearOfPublication,
                                                                 CoverImageUrl = x.CoverImageUrl,
                                                                 Publisher = x.Publisher.Name,
                                                                 AverageRate = ratingDict.Where(y => y.Key == x.Id).Select(y => y.Value).FirstOrDefault()
                                                             }).ToList();

            return new JsonResult(new GetVideoGameResponseModel()
            {
                DataSource = dataSource,
                IsAuthenticated = isAuthenticated
            });
        }

        /*************************************************************************************************************************************************************/

        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult Rating([FromBody] RatingRequestModel model)
        {
            var user = userService.GetCurrentUser();

            if (user == null)
            {
                return new JsonResult(new RatingResponseModel()
                {
                    FlashMessage = new FlashMessageModel(FlashMessageType.Error, "Log in for the rating!", 5)
                });
            }

            var videoGame = videoGameRepo.GetById(model.Id);

            if (videoGame == null)
            {
                return new JsonResult(new RatingResponseModel()
                {
                    FlashMessage = new FlashMessageModel(FlashMessageType.Error, "The video game does not exist!", 5)
                });
            }

            var allRatings = ratingRepo.Get(x => x.VideoGameId == model.Id).ToList();
            var ownRating = allRatings.FirstOrDefault(x => x.UserId == user.Id);

            if (ownRating == null)
            {
                ratingRepo.Insert(new Rating()
                {
                    User = user,
                    VideoGame = videoGame,
                    Value = model.Value
                });
            }
            else
            {
                ownRating.Value = model.Value;
                ratingRepo.Update(ownRating);
            }

            return new JsonResult(new RatingResponseModel()
            {
                AverageRate = allRatings.Where(x => x.UserId != user.Id).Select(x => x.Value).Concat(new List<int>() { model.Value }).Average()
            });
        }
    }
}
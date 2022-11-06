using GameRater.Data;
using GameRater.Repo;
using GameRater.Repo.Repository;
using GameRater.Services.Interfaces;
using GameRater.Web.UI.Models.Common;
using GameRater.Web.UI.Models.VideoGame;
using GameRater.Web.UI.Utils;
using Microsoft.AspNetCore.Mvc;


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

            var dataSource = videoGameRepo.Get(null, x => x.Skip(model.DataSourceLength)
                                                           .Take(appConfig.SizePerPage * 4)
                                                           .OrderBy(x => x.Title))
                                                           .Select(x => new VideoGameListItemModel()
                                                           {
                                                               Id = x.Id,
                                                               Title = x.Title,
                                                               YearOfPublication = x.YearOfPublication,
                                                               CoverImageUrl = x.CoverImageUrl,
                                                               Publisher = x.Publisher.Name,
                                                               AverageRate = ratingRepo.Get(y => y.VideoGameId == x.Id).Select(y => y.Value).DefaultIfEmpty(0).Average()
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
        public IActionResult Rating(RatingRequestModel model)
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
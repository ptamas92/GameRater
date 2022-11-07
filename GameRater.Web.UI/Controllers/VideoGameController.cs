using GameRater.Data;
using GameRater.Repo;
using GameRater.Repo.Repository;
using GameRater.Services.Interfaces;
using GameRater.Web.UI.Models.Common;
using GameRater.Web.UI.Models.VideoGame;
using GameRater.Web.UI.Utils;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
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
        public IActionResult GetVideoGames(GetVideoGamesRequestModel model)
        {
            var res = new GetVideoGamesResponseModel();
            var isAuthenticated = HttpContext.User.Identity?.IsAuthenticated ?? false;

            Dictionary<int, double> ratingDict;
            Expression<Func<VideoGame, bool>>? filter = null;

            if (isAuthenticated && model.IsFilteredByUser)
            {
                var userId = userService.GetCurrentUserId();

                filter = model.PublisherIdFilter != null ? (x => x.PublisherId == model.PublisherIdFilter && x.Ratings.Any(y => y.UserId == userId))
                                                         : (x => x.Ratings.Any(y => y.UserId == userId));

                ratingDict = ratingRepo.Get(x => x.UserId == userId).ToDictionary(x => x.VideoGameId, x => (double)x.Value);
            }
            else
            {
                if (model.PublisherIdFilter != null)
                    filter = (x => x.PublisherId == model.PublisherIdFilter); 
                
                ratingDict = ratingRepo.Get().GroupBy(x => x.VideoGameId).ToDictionary(x => x.Key, x => x.Average(y => y.Value));
            }

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
                                                                 PublisherId = x.PublisherId,
                                                                 Publisher = x.Publisher.Name,
                                                                 AverageRate = ratingDict.Where(y => y.Key == x.Id).Select(y => y.Value).FirstOrDefault()
                                                             }).ToList();

            return new JsonResult(new GetVideoGamesResponseModel()
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
                    FlashMessage = new FlashMessageModel(FlashMessageType.Error, "Login to rate!", 5)
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

            var allRatings = (model.ContentType == ContentType.Home) 
                ? ratingRepo.Get(x => x.VideoGameId == model.Id).ToList()
                : ratingRepo.Get(x => x.VideoGameId == model.Id && x.UserId == user.Id).ToList();

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
                AverageRate = allRatings.Where(x => x.UserId != user.Id).Select(x => x.Value).Concat(new List<int>() { model.Value }).Average(),
                FlashMessage = new FlashMessageModel(FlashMessageType.Success, "The rating was successful!", 3)
            });
        }

        /*************************************************************************************************************************************************************/

        [HttpGet]
        public IActionResult GetVideoGame(GetVideoGameRequestModel model)
        {
            var isAuthenticated = HttpContext.User.Identity?.IsAuthenticated ?? false;

            if (!isAuthenticated)
            {
                return new JsonResult(new GetVideoGameResponseModel()
                {
                    FlashMessage = new FlashMessageModel(FlashMessageType.Error, "Login to rate!", 5)
                });
            }

            var userId = userService.GetCurrentUserId();
            var rating = ratingRepo.Get(x => x.UserId == userId && x.VideoGameId == model.Id).FirstOrDefault();

            var dataSource = videoGameRepo.Get(x => x.Id == model.Id, null, "Publisher").Select(x => new VideoGameListItemModel()
            {
                Id = x.Id,
                Title = x.Title,
                Description = x.Description,
                YearOfPublication = x.YearOfPublication,
                CoverImageUrl = x.CoverImageUrl,
                PublisherId = x.PublisherId,
                Publisher = x.Publisher.Name,
                AverageRate = rating?.Value ?? 0
            }).FirstOrDefault();

            if (dataSource == null)
            {
                return new JsonResult(new GetVideoGameResponseModel()
                {
                    FlashMessage = new FlashMessageModel(FlashMessageType.Error, "The video game doesn't exist!", 5)
                });
            }

            return new JsonResult(new GetVideoGameResponseModel()
            {
                DataSource = dataSource
            });
        }
    }
}
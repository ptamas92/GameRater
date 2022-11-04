using GameRater.Data;
using GameRater.Repo;
using GameRater.Repo.Repository;
using GameRater.Web.UI.Models.VideoGame;
using GameRater.Web.UI.Utils;
using Microsoft.AspNetCore.Mvc;


namespace GameRater.Web.UI.Controllers
{
    public class VideoGameController : Controller
    {
        private readonly AppConfig appConfig;
        private readonly IRepository<ApplicationDbContext, Rating> ratingRepo;
        private readonly IRepository<ApplicationDbContext, VideoGame> videoGameRepo;

        public VideoGameController(AppConfig appConfig,
                                   IRepository<ApplicationDbContext, Rating> ratingRepo,
                                   IRepository<ApplicationDbContext, VideoGame> videoGameRepo)
        {
            this.appConfig = appConfig;
            this.ratingRepo = ratingRepo;
            this.videoGameRepo = videoGameRepo;
        }

        [HttpGet]
        //[ValidateAntiForgeryToken]
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
    }
}
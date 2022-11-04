using GameRater.Data;
using GameRater.Repo;
using GameRater.Repo.Repository;
using GameRater.Services.Interfaces;
using GameRater.Web.UI.Models.VideoGame;
using Microsoft.AspNetCore.Mvc;

namespace GameRater.Web.UI.Controllers
{
    public class VideoGameController : Controller
    {
        private readonly IUserService userService;
        private readonly IRepository<ApplicationDbContext, VideoGame> videoGameRepo;

        public VideoGameController(IUserService userService, IRepository<ApplicationDbContext, VideoGame> videoGameRepo)
        {
            this.userService = userService;
            this.videoGameRepo = videoGameRepo;
        }


        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult GetVideoGames(GetVideoGameRequestModel model)
        {
            var res = new GetVideoGameResponseModel();
            var userId = userService.GetCurrentUserId();


            var dataSource = videoGameRepo.GetAll().Select(x => new
            {
                x.Title,
                x.YearOfPublication,
                x.CoverImageUrl,
                x.Publisher.Name
            }).ToList();




            return new JsonResult(res);
        }
    }
}

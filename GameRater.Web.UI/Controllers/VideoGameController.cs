using GameRater.Services.Interfaces;
using GameRater.Web.UI.Models.VideoGame;
using Microsoft.AspNetCore.Mvc;

namespace GameRater.Web.UI.Controllers
{
    public class VideoGameController : Controller
    {
        private readonly IUserService userService;

        public VideoGameController(IUserService userService)
        {
            this.userService = userService;
        }


        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult GetVideoGames(GetVideoGameRequestModel model)
        {
            var res = new GetVideoGameResponseModel();
            var userId = userService.GetCurrentUserId();

            return new JsonResult(res);
        }
    }
}

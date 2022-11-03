using Microsoft.AspNetCore.Mvc;

namespace GameRater.Web.UI.Controllers
{
    public class VideoGameController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}

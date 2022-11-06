using GameRater.Models;
using GameRater.Web.UI.Utils;
using Microsoft.AspNetCore.Mvc;
using System.Diagnostics;

namespace GameRater.Controllers
{
    public class HomeController : Controller
    {
        private readonly ILogger<HomeController> logger;
        private readonly AppConfig appConfig;

        public HomeController(ILogger<HomeController> logger, AppConfig appConfig)
        {
            this.logger = logger;
            this.appConfig = appConfig;
        }

        public IActionResult Index(bool isLoginRequiredWarning = false)
        {
            ViewBag.SizePerPage = appConfig.SizePerPage;
            ViewBag.IsLoginRequiredWarning = isLoginRequiredWarning;

            return View();
        }

        public IActionResult MyRatings()
        {
            return RedirectToAction("Index", new { isLoginRequiredWarning = true });
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}
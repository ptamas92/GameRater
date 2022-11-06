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

        public HomeController( ILogger<HomeController> logger, AppConfig appConfig)
        {
            this.logger = logger;
            this.appConfig = appConfig;
        }

        public IActionResult Index()
        {
            ViewBag.SizePerPage = appConfig.SizePerPage;
            ViewBag.IsAuthenticated = HttpContext.User.Identity?.IsAuthenticated ?? false;

            return View();
        }

        public IActionResult MyRatings()
        {
            ViewBag.SizePerPage = appConfig.SizePerPage;
            ViewBag.IsAuthenticated = HttpContext.User.Identity?.IsAuthenticated ?? false;

            return View("Index");
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}
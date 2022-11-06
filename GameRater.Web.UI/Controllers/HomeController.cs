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

        [HttpGet]
        public IActionResult Index(bool isLoginRequiredWarning = false)
        {
            var isAuthenticated = HttpContext.User.Identity?.IsAuthenticated ?? false;

            ViewBag.SizePerPage = appConfig.SizePerPage;
            ViewBag.IsAuthenticated = isAuthenticated;
            ViewBag.IsLoginRequiredWarning = isLoginRequiredWarning;

            return View();
        }

        [HttpGet]
        public IActionResult MyRatings()
        {
            var isAuthenticated = HttpContext.User.Identity?.IsAuthenticated ?? false;

            if (!isAuthenticated)
                return RedirectToAction("Index", new { isLoginRequiredWarning = true });

            ViewBag.SizePerPage = appConfig.SizePerPage;
            ViewBag.IsAuthenticated = isAuthenticated;
            ViewBag.IsLoginRequiredWarning = false;

            return View("Index");
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}
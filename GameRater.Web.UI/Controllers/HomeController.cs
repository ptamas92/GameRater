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
            SetViewBag(isLoginRequiredWarning, out _);

            return View();
        }

        [HttpGet]
        public IActionResult MyRatings()
        {
            SetViewBag(false, out bool isAuthenticated);

            if (!isAuthenticated)
                return RedirectToAction("Index", new { isLoginRequiredWarning = true });

            return View("Index");
        }

        [HttpGet]
        public IActionResult VideoGame(int id)
        {
            SetViewBag(false, out bool isAuthenticated);

            if (!isAuthenticated)
                return RedirectToAction("Index", new { isLoginRequiredWarning = true });

            return View("Index");
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }

        /******************************************************************************************************************************/

        private void SetViewBag(bool isWarning, out bool isAuthenticated)
        {
            isAuthenticated = HttpContext.User.Identity?.IsAuthenticated ?? false;

            ViewBag.SizePerPage = appConfig.SizePerPage;
            ViewBag.IsAuthenticated = isAuthenticated;
            ViewBag.IsLoginRequiredWarning = isWarning;
        }
    }
}
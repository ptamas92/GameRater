using Microsoft.AspNetCore.Mvc;

namespace GameRater.Web.UI.Utils
{
    public static class UrlHelperExtension
    {
        public static string GetUrlRoot(this IUrlHelper url, string contentPath)
        {
            var request = url.ActionContext.HttpContext.Request;
            return new Uri(new Uri(request.Scheme + "://" + request.Host.Value), url.Content(contentPath)).ToString();
        }
    }
}

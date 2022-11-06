using GameRater.Web.UI.Models.Common;

namespace GameRater.Web.UI.Models.VideoGame
{
    public class GetVideoGameRequestModel : TableComponentRequestModel
    {
        public bool IsFilter { get; set; } = false;
    }

    public class GetVideoGameResponseModel : TableComponentResponseModel
    {
        public bool IsAuthenticated { get; set; }
    }

    /*****************************************************************************************/

    public class VideoGameListItemModel
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public int YearOfPublication { get; set; }
        public string CoverImageUrl { get; set; }
        public string Publisher { get; set; }
        public double AverageRate { get; set; }
    }
}

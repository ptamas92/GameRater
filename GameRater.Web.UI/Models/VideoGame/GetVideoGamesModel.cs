using GameRater.Web.UI.Models.Common;

namespace GameRater.Web.UI.Models.VideoGame
{
    public class GetVideoGamesRequestModel : TableComponentRequestModel
    {
        public bool IsFilteredByUser { get; set; } = false;

        public int? PublisherIdFilter { get; set; }
    }

    public class GetVideoGamesResponseModel : TableComponentResponseModel
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

        public int PublisherId { get; set; }

        public string Publisher { get; set; }

        public double AverageRate { get; set; }
    }
}

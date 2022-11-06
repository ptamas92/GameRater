using GameRater.Web.UI.Models.Common;

namespace GameRater.Web.UI.Models.VideoGame
{
    public enum ContentType
    {
        Home = 0,
        MyRatings = 1
    }

    public class RatingRequestModel
    {
        public int Id { get; set; }
        public int Value { get; set; }
        public ContentType ContentType { get; set; }
    }

    public class RatingResponseModel
    {
        public double? AverageRate { get; set; }
        public FlashMessageModel? FlashMessage { get; set; }
    }
}

using GameRater.Web.UI.Models.Common;

namespace GameRater.Web.UI.Models.VideoGame
{
    public class RatingRequestModel
    {
        public int Id { get; set; }
        public int Value { get; set; }    
    }

    public class RatingResponseModel
    {
        public double? AverageRate { get; set; }
        public FlashMessageModel? FlashMessage { get; set; }
    }
}

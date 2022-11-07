using GameRater.Web.UI.Models.Common;

namespace GameRater.Web.UI.Models.VideoGame
{
    public class GetVideoGameRequestModel
    {
        public int Id { get; set; }
    }

    public class GetVideoGameResponseModel
    {
        public FlashMessageModel? FlashMessage { get; set; }
        public VideoGameListItemModel? DataSource { get; set; }
    }
}

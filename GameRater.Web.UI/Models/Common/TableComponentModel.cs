namespace GameRater.Web.UI.Models.Common
{
    public abstract class TableComponentRequestModel
    {
        public string SortedBy { get; set; }

        public bool IsAscending { get; set; }

        public int DataSourceLength { get; set; }
    }

    public abstract class TableComponentResponseModel
    {
        public FlashMessageModel? FlashMessage { get; set; }

        public object DataSource { get; set; }
    }
}

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

        public List<object> DataSource { get; set; } = new List<object>();
    }
}

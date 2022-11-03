using System;

namespace GameRater.Web.UI.Models.Common
{
    public enum FlashMessageType
    {
        Success = 0,
        Error = 1,
        Warning = 2,
        Info = 3
    }

    public class FlashMessageModel
    {
        public FlashMessageModel(FlashMessageType resultType, string messageTransKey, int timeOutInSeconds = 0)
        {
            TimeOut = timeOutInSeconds * 1000;
            MessageTransKey = messageTransKey;
            ResultType = GetResultTypeAsString(resultType);
        }

        public int TimeOut { get; set; }
        public string MessageTransKey { get; set; }
        public string ResultType { get; set; }


        private static string GetResultTypeAsString(FlashMessageType resultType)
        {
            return resultType switch
            {
                FlashMessageType.Success => "success",
                FlashMessageType.Error => "danger",
                FlashMessageType.Warning => "warning",
                FlashMessageType.Info => "info",
                _ => "danger",
            };
        }
    }
}

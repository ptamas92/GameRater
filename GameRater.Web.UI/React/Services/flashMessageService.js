import * as EventHandlerService from "./eventHandlerService";
export var IFlashMessageType;
(function (IFlashMessageType) {
    IFlashMessageType[IFlashMessageType["Success"] = 0] = "Success";
    IFlashMessageType[IFlashMessageType["Warning"] = 1] = "Warning";
    IFlashMessageType[IFlashMessageType["Error"] = 2] = "Error";
    IFlashMessageType[IFlashMessageType["Info"] = 3] = "Info";
})(IFlashMessageType || (IFlashMessageType = {}));
export function show(type, message, timeOutInMilliseconds) {
    var resultType = "info";
    if (typeof type === "string" || type instanceof String) {
        resultType = type;
    }
    else {
        switch (type) {
            case IFlashMessageType.Success:
                resultType = "success";
            case IFlashMessageType.Warning:
                resultType = "warning";
            case IFlashMessageType.Error:
                resultType = "danger";
        }
    }
    var obj = {
        resultType: resultType,
        message: message,
        timeOut: timeOutInMilliseconds !== null ? timeOutInMilliseconds : 0
    };
    EventHandlerService.callEvent("event_flash_message_display", JSON.stringify(obj));
}
//# sourceMappingURL=flashMessageService.js.map
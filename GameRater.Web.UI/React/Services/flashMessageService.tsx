import * as EventHandlerService from "./eventHandlerService";

export enum IFlashMessageType {
    Success,
    Warning,
    Error,
    Info
}

export function show(type: any, message: string, timeOutInMilliseconds?: number) {
    var resultType = "info";

    if (typeof type === "string" || type instanceof String) {
        resultType = type as string;
    }
    else {
        switch (type as IFlashMessageType) {
            case IFlashMessageType.Success:
                resultType = "success";
            case IFlashMessageType.Warning:
                resultType = "warning";
            case IFlashMessageType.Error:
                resultType = "danger";
        }
    }

    var obj = {
        ResultType: resultType,
        Message: message,
        TimeOut: timeOutInMilliseconds !== null ? timeOutInMilliseconds : 0
    }

    EventHandlerService.callEvent("event_flash_message_display", JSON.stringify(obj));
}
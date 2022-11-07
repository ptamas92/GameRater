import * as EventHandlerService from "./eventHandlerService";

declare var requestVerificationToken, requestVerificationTokenName;

//rating
export function rating(item, starKey, contentType) {

    var params = {
        Id: item.Id,
        Value: starKey,
        ContentType: contentType
    };

    return fetch("/VideoGame/Rating",
        {
            method: 'post',
            headers: { 'Accept': 'application/json', 'Content-Type': 'application/json', [requestVerificationTokenName]: requestVerificationToken },
            body: JSON.stringify(params)
        })
        .then(res => res.json())
        .then((result) => {
            if (result.FlashMessage !== null)
                EventHandlerService.callEvent("event_flash_message_display", JSON.stringify(result.FlashMessage));

            return result;

        }, (error) => {
            console.log(error);

            return null;
        })
}
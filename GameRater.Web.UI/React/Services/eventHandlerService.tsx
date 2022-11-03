
//callEvent
export function callEvent(eventName: string, detail?: string) {
    var event;

    if (detail === null)
        detail = "";

    if (typeof (Event) === 'function') {
        event = new CustomEvent(eventName, { detail: detail });
    }
    else {
        event = document.createEvent("CustomEvent");
        event.initCustomEvent(eventName, false, false, detail);
    }

    window.dispatchEvent(event);
}
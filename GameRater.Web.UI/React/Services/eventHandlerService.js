//callEvent
export function callEvent(eventName, detail) {
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
//# sourceMappingURL=eventHandlerService.js.map
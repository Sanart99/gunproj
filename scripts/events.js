class Events {
    static listeners = {};
    static loggingEnabled = true;

    static addEventListener(eventNames,id,f) {
        const listener = { id:id, f:f };
        for (const evName of eventNames) {
            if (this.listeners[evName] == null) this.listeners[evName] = new Set();
            this.listeners[evName].add(listener);
            if (this.loggingEnabled) this.#log(`+ Added to ${evName}`,listener);
        }
    }

    static removeEventListener(eventNames,id) {
        for (const evName of eventNames) {
            const a = [];
            if (this.listeners[evName] != null) for (const listener of this.listeners[evName]) if (listener.name === id) a.push(listener);
            for (const listener of a) {
                this.listeners[evName].delete(listener);
                if (this.loggingEnabled) this.#log(`- Removed from ${evName}`,listener);
            }
        }
    }

    static trigger(eo) {
        if (!(eo instanceof EventObject)) throw new Error("Not an EventObject.");
        if (this.loggingEnabled) this.#log(`· ${eo.name}`,eo.data);
        if (this.listeners[eo.name] != null) for (const listener of this.listeners[eo.name]) listener?.f(eo);
    }

    static #log(msg,o) {
        console.log(
            `%cEVENT%c ${msg}: %O`,
            'background: #9f9f9f; color:white; border-radius:2px; display:inline-block; padding: 0px 4px',
            'background: unset; color:unset',
            o
        );
    }
}
class EventObject {
    constructor(name,data) {
        if (typeof name !== 'string' || this.name === '') throw new Error(`Invalid event object name. ${name}`);
        this.name = name;
        this.data = data;
    }
}
document.addEventListener('keydown', function(ev) {
    if ((ev.key === "F5" && !ev.ctrlKey) || (ev.ctrlKey && ev.key === "r")) {
        SW.postMessage('check swHash');
        Events.trigger(new EventObject('page_refresh',{event:ev}));
        ev.preventDefault();
    }
});
class BaseElement extends HTMLElement {
    static observedAttributes = ['disabled'];

    _disabledAttributePropagation = true;
    get disabled() { return this.getAttribute('disabled') !== null; }
    set disabled(val) {
        const b = val != null && val != false;
        if (b && !this.disabled) this.setAttribute('disabled','true');
        else if (!b && this.disabled) this.removeAttribute('disabled');
    }

    listeners = new Set();

    constructor() {
        super();

        const shadowRoot = this.attachShadow({ mode:"open" });
        shadowRoot.replaceChildren(...stringToNodes(
        `<link rel="stylesheet" href="styleReset.css" type="text/css">
        <style>
            :host {
                position: relative;
                transition: all 0.25s;
            }
            :host([disabled]) {
                opacity: 0.5;
                pointer-events: none;
                user-select: none;
            }
        </style>
        `));

        this.classList.add('component');

        let parentHost = this.getRootNode()?.host;
        while (parentHost != null) {
            if (parentHost instanceof RouterElement) { this.router = parentHost; break; }
            parentHost = parentHost?.getRootNode()?.host;
        }
    }

    addStyle(s) {
        const style = document.createElement('style');
        style.innerHTML = s.trim();
        let e = this.shadowRoot.querySelector('style:last-of-type') ?? this.shadowRoot.querySelector('link[rel="stylesheet"]:first-of-type');
        e.insertAdjacentElement('afterend',style);
    }

    listenToComponentEvents(c,f) {
        if (!(c instanceof BaseElement)) throw new Error('Not a compatible component.');
        this.#eventLog(`+ ${c.constructor.name}`,f);
        c.listeners.add({id:this,f:f});
    }

    stopListeningToComponentEvents(component,f=null) {
        this.#eventLog(`- ${component.constructor.name}`,f);
        if (f !== null) { if (component.listeners.delete({id:this,f:f})) return; }
        else {
            const a = [];
            for (const o of component.listeners) if (o.id === component) a.push(o);
            for (const o of a) component.listeners.delete(o);
            if (a.length > 0) return;
        }
        this.#eventLog(`!- ${component.constructor.name}`,f);
    }

    emitEvent(eo) {
        if (!eo instanceof EventObject) throw new Error('Not an EventObject.');
        if (Events.loggingEnabled) this.#eventLog(`· ${eo.name}`,eo.data);
        for (const listener of this.listeners) listener.f(eo);
    }

    connectedCallback() {
        this.disabled = this.getAttribute('disabled') !== null;
    }

    attributeChangedCallback(name,oldValue,newValue) {
        switch (name) {
            case 'disabled':
                this.disabled = newValue !== null;
                if (this._disabledAttributePropagation) this.#fDisabledAttributePropagation(this,this.disabled);
                break;
            default: break;
        }
    }

    #eventLog(msg,o) {
        console.log(
            `%cEVENT%c${this.constructor.name}%c ${msg}: %O`,
            'background: #9f9f9f; color:white; border-radius: 2px 0px 0px 2px; display:inline-block; padding: 0px 4px',
            'background:rgb(201, 201, 201); color:black; border-radius: 0px 2px 2px 0px; display:inline-block; padding: 0px 4px',
            'background: unset; color:unset',
            o
        );
    }

    #fDisabledAttributePropagation(elem,b) {
        if (!isEmpty(elem.shadowRoot)) for (const e of elem.shadowRoot.children) {
            if (e instanceof HTMLInputElement || e instanceof BaseElement || e instanceof HTMLFormElement || e instanceof HTMLDivElement) {
                e.disabled = b;
                if (e._disabledAttributePropagation !== true) this.#fDisabledAttributePropagation(e,b);
            }
        }

        for (const e of elem.children) {
            if (e instanceof HTMLInputElement || e instanceof BaseElement || e instanceof HTMLFormElement || e instanceof HTMLDivElement) {
                e.disabled = b;
                if (e._disabledAttributePropagation !== true) this.#fDisabledAttributePropagation(e,b);
            }
        }
    }
}
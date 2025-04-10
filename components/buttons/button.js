class ButtonElement extends BaseFocusableElement {
    static formAssociated = true;
    static observedAttributes = ['disabled','text','raw-text'];

    constructor() {
        super();
        this.internals = this.attachInternals();

        this.addStyle(`
            :host {
                display: flex;
                flex-direction: column;
                color: white;
                min-height: 1.5em;
                outline: 0.1em solid black;
                text-shadow: 0px 0.055em 0.105em black;
                cursor: pointer;
                text-align: center;
                justify-content: center;
                box-sizing: border-box;
                background: #808080;
                transition: all 0.25s, transform 0.1s;
            }
            :host(:hover) {
                outline-color: #ffffffcf;
            }
            :host(:active) {
                transform: scale(0.98);
            }
            #p {
                padding: 0.3em 0px;
                user-select: none;
            }
        `);

        this.shadowRoot.append(...stringToNodes(`<slot name="content"><p id="p" part="p"></p></slot>`));

        this.eP = this.shadowRoot.querySelector('#p');

        this.setAttribute('role','button');
        this.setAttribute('aria-pressed','false');
        this.setAttribute('aria-labelledby','p');
        this.setAttribute('title','Se connecter');

        this.addEventListener('pointerdown',() => {
            this.setAttribute('aria-pressed','true');
            document.addEventListener('pointerup',() => this.setAttribute('aria-pressed','false'));
        });
        this.addEventListener('click',() => {
            if (this.getAttribute("type") === 'submit') this.#requestSubmit();
        });
        this.addEventListener('keydown',(ev) => {
            if (this.getAttribute("type") !== 'submit') return;
            if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); this.#requestSubmit(); }
        });
    }

    connectedCallback() {
        super.connectedCallback();
        this.eP.innerText = this.getAttribute('text')??'';
        if (this.eP.innerText == '') this.eP.innerHTML = this.getAttribute('raw-text')??'';
    }

    attributeChangedCallback(name,oldValue,newValue) {
        super.attributeChangedCallback(name,oldValue,newValue);
        switch (name) {
            case 'text': if (this.eP != null) this.eP.innerText = newValue; break;
            case 'raw-text': if (this.eP != null) this.eP.innerHTML = newValue; break;
            default: break;
        }
    }

    #requestSubmit()  {
        if (this.disabled === true) return;
        this.internals.form.requestSubmit();
    }
}
customElements.define("c-button", ButtonElement);
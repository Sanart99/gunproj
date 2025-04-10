class ModalElement extends BaseElement {
    get keepOpen() { return this.getAttribute('keep-open') !== null; }

    constructor() {
        super();

        this.setAttribute('role','dialog');
        this.setAttribute('aria-modal','true');

        this.addStyle(`
            :host {
                position: fixed;
                width: 100vw;
                height: 100vh;
                top: 0px;
                left: 0px;
                background: #00000055;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            slot[name="content"] {
                position: relative;
            }
        `);

        this.shadowRoot.append(...stringToNodes(`<slot name="content"></slot>`));

        const shadowRoot = this.shadowRoot;
        this.eContent = shadowRoot.querySelector('slot[name="content"]');

        let contentClicked = false;
        this.eContent.addEventListener('click',(ev) => {
            contentClicked = true;
        });
        this.addEventListener('click',(ev) => {
            if (!this.keepOpen && !contentClicked) this.remove();
            contentClicked = false;
        });
    }
}
customElements.define("c-modal", ModalElement);
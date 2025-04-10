class QuickModalElement extends BaseElement {
    constructor() {
        super();

        this.addStyle(`
            c-modal {
                z-index: 1;
                transition: unset;
            }
            slot[name="content"] {
                background: white;
                border: 4px solid black;
                width: 75%;
                max-width: 1000px;
                min-height: 25%;
                display: flex;
                flex-direction: column;
                justify-content: center;
                gap: 1em;
                font-size: 1.2em;
                padding: 0.5em;
            }
        `);

        this.shadowRoot.append(...stringToNodes(`<c-modal part="modal" keep-open="true"><slot name="content" slot="content" part="content"></slot></c-modal>`));
    }
}
customElements.define("c-quick-modal", QuickModalElement);
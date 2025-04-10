class GalleryElement extends BaseElement {
    constructor() {
        super();

        this.addStyle(`
            :host {
                display: flex;
                flex-direction: column;
                align-items: center;
            }
            c-gallery-item {
                margin: 1em;
                flex: 1 0 100%;
                max-height: 25em;
            }
        `);

        this.shadowRoot.append(...stringToNodes(`
            
        `.trim()));

        fetch("products/list.json").then((res) => res.json()).then((json) => {
            const imgs = json?.gun_images;
            if (imgs == null || !Array.isArray(imgs)) return;

            for (const img of imgs) {
                const e = new GalleryItemElement();
                e.load(img);
                this.shadowRoot.append(e);
            }
        });
    }
}
customElements.define("c-gallery", GalleryElement);
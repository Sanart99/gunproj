class GalleryElement extends BaseElement {
    constructor() {
        super();

        this.addStyle(`
            :host {
                display: flex;
                flex-wrap: wrap;
                justify-content: center;
            }
            c-gallery-item {
                margin: 1em;
            }
        `);

        this.shadowRoot.append(...stringToNodes(`
            
        `.trim()));

        fetch("products/list.json").then((res) => res.json()).then((json) => {
            const categories = json?.categories;
            if (categories == null) return;
            for (const category of json.categories) {
                const catName = category?.name;
                const entries = category?.entries;
                if (entries == null) continue;

                for (let i=0; i<20; i++) for (const entry of entries) {
                    fetch(`products/${catName}/entries/${entry}.json`).then((res) => res.json()).then((json) => {
                        const e = new GalleryItemElement();
                        e.load(catName,json);
                        this.shadowRoot.appendChild(e);
                    });
                }
            }
        });
    }
}
customElements.define("c-gallery", GalleryElement);
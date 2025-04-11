class GalleryElement extends BaseElement {
    constructor() {
        super();

        this.addStyle(`
            :host {
                display: flex;
                flex-direction: column;
                align-items: center;
            }
            .category {
                display: flex;
                flex-direction: column;
            }
            .items {
                display: flex;
                flex-wrap: wrap;
            }
            .categoryName {
                text-align: center;
                font-size: 3em;
                margin: 0.5em 0px;
            }
            c-gallery-item {
                max-width: 150px;
            }
        `);

        fetch("products/list.json").then((res) => res.json()).then((json) => {
            const categories = json?.categories;
            if (categories == null || !Array.isArray(categories)) return;

            for (const category of categories) {
                const catName = category.name;
                const filePaths = category.filePaths;

                const eCat = stringToNodes(`<div class="category">
                    <p class="categoryName">${catName}</p>
                    <div class="items"></div>
                </div>`)[0];
                const eItems = eCat.querySelector('.items');
                this.shadowRoot.appendChild(eCat);
                for (const filePath of filePaths) {
                    const e = new GalleryItemElement();
                    e.load(filePath);
                    eItems.append(e);
                }
            }
        });
    }
}
customElements.define("c-gallery", GalleryElement);
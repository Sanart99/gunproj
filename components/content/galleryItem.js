class GalleryItemElement extends BaseElement {
    imgs = [];
    price = null;

    constructor() {
        super();

        this.addStyle(`
            :host {
                max-width: 85%;
                max-height: 25em;
                text-align: center;
            }
            #imgDiv {
                max-width: 100%;
                max-height: 100%;
                width: 100%;
                height: 400px;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            #img {
                max-width: 100%;
                max-height: 25em;
                object-fit: contain;
            }
            #img:not([src="no-image.png"]) {
                cursor: pointer;
            }
        `);

        this.shadowRoot.append(...stringToNodes(`
            <img id="img" src="no-image.png" alt="no image"/>
        `.trim()));

        this.eImg = this.shadowRoot.querySelector('#img');
    }

    load(img) {
        this.eImg.src = `products/images/${img}`;
        this.eImg.addEventListener('click',() => {
            location.href = `products/images/${img}`;
        });
    }
}
customElements.define("c-gallery-item", GalleryItemElement);
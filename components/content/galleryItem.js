class GalleryItemElement extends BaseElement {
    imgs = [];
    price = null;

    constructor() {
        super();

        this.addStyle(`
            :host {
                max-width: 11em;
                max-height: 11em;
            }
            #mainDiv {
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: space-between;
                width: 11em;
                height: 11em;
                cursor: pointer;

                transform: translate(-50%, -50%);
                position: relative;
                top: 50%;
                left: 50%;
                transition: 0.15s;
            }
            :host(:hover) #mainDiv {
                width: 13em;
                height: 13em;
            }
            #imgDiv {
                width: 100%;
                height: 80%;
                display: flex;
                justify-content: center;
            }
            #img {
                max-width: 100%;
                max-height: 100%;
            }
            #name {
                font-size: 1.2em;
                margin: 0.5em;
            }
        `);

        this.shadowRoot.append(...stringToNodes(`
            <div id="mainDiv">
                <div id="imgDiv">
                    <img id="img" src="no-image.png" alt="no image"/>
                </div>
                <p id="name">[NAME]</p>
            </div>
        `.trim()));

        this.eName = this.shadowRoot.querySelector('#name');
        this.eImgDiv = this.shadowRoot.querySelector('#imgDiv');
        this.eImg = this.shadowRoot.querySelector('#img');
    }

    load(categoryName,json) {
        const name = json?.name;
        const imgs = json?.images;
        const price = json?.price;

        this.eName.innerText = name;

        if (Array.isArray(imgs)) {
            if ((imgs[0]??null) != null) this.eImg.src = `products/${categoryName}/images/${imgs[0]}`;
            this.imgs = imgs;
        }
    }
}
customElements.define("c-gallery-item", GalleryItemElement);
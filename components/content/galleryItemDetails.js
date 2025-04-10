class GalleryItemDetailsElement extends BaseElement {
    constructor() {
        super();

        this.addStyle(`
            :host {
                display: flex;
                justify-content: center;
            }
            #carousel_main {
                display: flex;
            }
            #carousel_main_images {
                
            }
            #carousel_preview {
                display: flex;
            }
        `);

        this.shadowRoot.append(...stringToNodes(`
            <div id="carousel_main">
                <div>←</div>
                <div id="carousel_main_images">
                    <img id="img" src="no-image.png" alt="no image"/>
                    <img id="img" src="no-image.png" alt="no image"/>
                    <img id="img" src="no-image.png" alt="no image"/>
                    <img id="img" src="no-image.png" alt="no image"/>
                    <img id="img" src="no-image.png" alt="no image"/>
                    <img id="img" src="no-image.png" alt="no image"/>
                </div>
                <div>→</div>
            </div>
            <div id="carousel_preview>
                <img id="img" src="no-image.png" alt="no image"/>
                <img id="img" src="no-image.png" alt="no image"/>
                <img id="img" src="no-image.png" alt="no image"/>
                <img id="img" src="no-image.png" alt="no image"/>
                <img id="img" src="no-image.png" alt="no image"/>
                <img id="img" src="no-image.png" alt="no image"/>
            </div>
        `.trim()));
    }
}
customElements.define("c-gallery-item-details", GalleryItemDetailsElement);
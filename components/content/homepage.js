class HomepageElement extends BaseElement {
    constructor() {
        super();

        this.addStyle(`
            :host {
                display: flex;
                flex-direction: column;
                align-items: center;
            }
            c-header {
                position: sticky;
                top: 0px;
                z-index: 10;
                background: #ffffffbf;
                backdrop-filter: blur(1px);
            }
            c-gallery {
                width: 96%;
            }
            footer {
                margin: 1em;
            }
            #productsDiv {
                display: flex;
                flex-direction: column;
                align-items: center;
                width: 90%;
            }
            #productsDiv > p {
                font-size: 3em;
                margin: 0.8em 0px 0.4em 0px;
            }
            #privPolicyLink {
                font-weight: bold;
                color: black;
            }
            #privacyPolicy {
                display: flex;
                flex-direction: column;
                justify-content: center;
                gap: 1em;
            }
            #privacyPolicy h1 {
                font-size: 2em;
                margin: 0.2em 0px 0em 0px;
                text-align: center;
            }
            #privacyPolicy_ok {
                outline: 0;
                background: black;
                width: max(9%,6ch);
                align-self: center;
                height: 2.3em;
                border-radius: 0.3em;
                margin: 0px 0px 0.5em 0px;
            }
            #butAcceptCookie {
                background: green;
            }
            #butAcceptCookie:hover {
                outline-color: black;
            }
            #sentence {
                font-size: 1.5em;
                text-decoration: underline;
            }
            #email {
                margin: 2em 0px;
                font-size: 1.3em;
            }
        `);

        this.shadowRoot.append(...stringToNodes(`
            <c-header></c-header>

            <p id="sentence">Local orders near Baytown, TX. Licensed FFL dealer</p>
            <p id="email">Email: <a href="mailto:3Axisworkshop@gmail.com">3Axisworkshop@gmail.com</a></p>

            <div id="productsDiv">
                <c-gallery></c-gallery>
            </div>

            <footer><p>Copyright © 2025 3Axisworkshop LLC · All Rights Reserved. · <a id="privPolicyLink" href="#" onclick="return false;">Privacy Policy</a></p></footer>
        `.trim()));

        const privPolicyLink = this.shadowRoot.querySelector('#privPolicyLink');
        privPolicyLink.addEventListener('click',() => {
            const e = stringToNodes(`<c-quick-modal>
                <div id="privacyPolicy" slot="content">
                    <h1>Privacy Policy</h1>
                    <p>This website displays an embedded Google Map. When you view the map, your browser may connect to Google servers and transmit certain technical data (such as your IP address). This interaction is governed by <a href="https://policies.google.com/privacy" target="_blank">Google's Privacy Policy</a>.<p>
                    <p><b>We do not collect, store, or process any personal data directly through this website.</b></p>
                    <c-button id="privacyPolicy_ok" text="Ok"></c-button>
                </div>
            </c-quick-modal>`)[0];
            e.querySelector('#privacyPolicy_ok').addEventListener('click',() => e.remove());
            this.shadowRoot.appendChild(e);
        });
    }
}
customElements.define("c-homepage", HomepageElement);
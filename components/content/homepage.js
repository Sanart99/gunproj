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
            #gmapDiv:not(.disabled) {
                border: 1px solid black;
                width: 40%;
                height: 28em;
                min-width: min(33em,78%);
                margin: 1em 0px 2em 0px;
            }
            #gmapDiv.disabled {
                display: flex;
                height: 9em;
                gap: 1em;
                flex-direction: column;
                justify-content: center;
                border: 3px dashed black;
                width: 75%;
                padding: 1em 2em;
            }
            #gmap {
                width: 100%;
                height: 100%;
                border: 0;
                position: relative;
                z-index: 1;
            }
            #productsDiv {
                display: flex;
                flex-direction: column;
                align-items: center;
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
        `);

        this.shadowRoot.append(...stringToNodes(`
            <c-header></c-header>

            <div id="gmapDiv" class="disabled">
                <p>Google Maps needs you to accept its tracking and advertising cookies. (see <a href="https://policies.google.com/technologies/cookies" target="_blank">Google's Cookie Policy</a>)</p>
                <c-button id="butAcceptCookie" text="Accept"></c-button>
            </div>

            <div id="productsDiv">
                <c-gallery></c-gallery>
            </div>

            <footer><p>Copyright © 2025 · All Rights Reserved. · <a id="privPolicyLink" href="#" onclick="return false;">Privacy Policy</a></p></footer>
        `.trim()));

        const privPolicyLink = this.shadowRoot.querySelector('#privPolicyLink');
        const gmapDiv = this.shadowRoot.querySelector('#gmapDiv');
        const eButAcceptCookie = this.shadowRoot.querySelector('#butAcceptCookie');

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

        const eCookiePolicy = stringToNodes(`<c-quick-modal>
            <div id="cookiePolicy" slot="content">
                <h1>Cookie Policy</h1>
                <p>This website displays an embedded Google Map. When you view the map, your browser may connect to Google servers and transmit certain technical data (such as your IP address). This interaction is governed by <a href="https://policies.google.com/privacy" target="_blank">Google's Privacy Policy</a>.<p>
                <p><b>We do not collect, store, or process any personal data directly through this website.</b></p>
                <c-button id="cookiePolicy_ok" text="Ok"></c-button>
            </div>
        </c-quick-modal>`);

        // GMap + Cookies
        const eGMap = stringToNodes('<iframe id="gmap" sandbox="allow-scripts" loading="lazy" allowfullscreen referrerpolicy="no-referrer-when-downgrade" src="https://www.google.com/maps/embed/v1/place?q=457+Parkside+Blvd,+Suite+320,+San+Mateo,+CA+94403&key=AIzaSyCwjOChdJgX2lk92sNjJCoYX6HQseH9sZ8"></iframe>')[0];
        const bGoogle = sessionGet('google-cookie-consent');
        if (bGoogle !== '1') {
        } else {
            gmapDiv.innerHTML = '';
            gmapDiv.appendChild(eGMap);
        }

        eButAcceptCookie.addEventListener('click',() => {
            gmapDiv.innerHTML = '<p style="position:absolute">Google map loading...</p>';
            gmapDiv.classList.remove('disabled');
            gmapDiv.appendChild(eGMap);
        });
    }
}
customElements.define("c-homepage", HomepageElement);
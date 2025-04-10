class HeaderElement extends BaseElement {
    constructor() {
        super();

        this.addStyle(`
            :host {
                display: flex;
                width: 100%;
                justify-content: space-between;
                align-items: center;
                padding: 0px 10%;
                box-sizing: border-box;
            }
            #logoDiv {
                display: flex;
                font-size: 2em;
                align-items: center;
                margin: 0.5em;
            }
            #logo {
                width: 2em;
            }
            #name {
                margin: 0px 0px 0px 0.5em;
            }
            c-button {
                background: black;
                padding: 0.5em;
                border-radius: 0.9em;
                outline: 0;
                display: flex;
                margin: 0px 0.5em 0px 0px;
            }
            #phoneImg {
                width: 1.5em;
                min-width: 1.5em;
                margin: 0px 0.4em 0px 0px;
                filter: drop-shadow(0px 0px 2px black);
            }
            #phoneDiv {
                display: flex;
                align-items: center;
            }
            @media screen and (max-width: 800px) {
                :host {
                    display: flex;
                    padding: 2px;
                }
                #logoDiv {
                    font-size: 1.5em;
                }
            }

            @keyframes phone {
                41% {
                    transform: scale(2) rotate(0deg);
                }
                45% {
                    transform: scale(2) rotate(-20deg);
                }
                50% {
                    transform: scale(2) rotate(20deg);
                }
                55% {
                    transform: scale(2) rotate(-20deg);
                }
                60% {
                    transform: scale(2) rotate(20deg);
                }
                70% {
                    transform: scale(2) rotate(0deg);
                }
            }
        `);

        this.shadowRoot.append(...stringToNodes(`
            <div id="logoDiv">
                <img id="logo" src="logo.webp" alt="logo"/>
                <p id="name">NovTech Solutions</p>
            </div>
            <div id="contactDiv">
                <c-button>
                    <div id="phoneDiv" slot="content">
                        <svg id="phoneImg" xmlns=\"http://www.w3.org/2000/svg\" fill=\"none\" viewBox=\"0 0 24 24\" stroke-width=\"1.5\" stroke=\"currentColor\" class=\"size-6\">
                            <path stroke-linecap=\"round\" stroke-linejoin=\"round\" d=\"M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z\" />
                        </svg>
                        <p>Call Now (650) 555-0134</p>
                    </div>
                </c-button>
            </div>
        `.trim()));


        this.eCall = this.shadowRoot.querySelector('#contactDiv c-button');
        this.eCall.addEventListener('click',() => {
            window.location.href='tel:+6505550134';
        });

        const svg = this.eCall.querySelector('svg');
        const svgAnim = () => {
            svg.style.animation = "2s phone";
            setTimeout(() => svg.style.animation = 'unset', 2100);
        };
        setTimeout(() => {
            svgAnim();
            setInterval(svgAnim,15000);
        },3000);
    }
}
customElements.define("c-header", HeaderElement);
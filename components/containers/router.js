class RouterElement extends BaseElement {
    #urlFormatter = null;
    static mainRouter = null;
    currentURL = '';

    pageToLoadAfterEnabled = null;
    contentToLoadAfterEnabled = null;
    routerActivated = true;

    get urlFormatter() { return this.#urlFormatter; }

    constructor() {
        super();

        this.setDefaultUrlFormatter();

        this.addStyle(`
            :host { display: block; }
            #router { width:100%; height:100%; }
        `);

        this.shadowRoot.append(...stringToNodes(`<div id="router"></div>`));

        this.eRouter = this.shadowRoot.querySelector('#router');

        Events.addEventListener(['page_refresh'],this,(eo) => {
            if (eo.name != 'page_refresh') return;
            this.loadContent(this.currentURL,StateAction.None);
        });

        RouterElement.mainRouter ??= this;
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        Events.removeEventListener(['page_refresh'],this);
    }

    async loadPage(url, stateAction=-1, options=null) {
        if (url == '') return;
        if (!this.routerActivated) { this.pageToLoadAfterEnabled = {url,stateAction,options}; this.contentToLoadAfterEnabled = null; return; }

        const urlFormatter = options?.urlFormatter ?? this.#urlFormatter;
        const nonOkResponseHandler = options?.nonOkResponseHandler;

        for (const o of LinkInterceptor.preProcesses) {
            url = o.f(url,stateAction);
            if (url === false) return;
        }

        let test = false;
        return fetch(url).then((response) => {
            if (!response.ok) {
                if (nonOkResponseHandler == null) throw `Failed to load '\${url}'.`;
                else nonOkResponseHandler(url, stateAction);
            }
            if (response.headers.get('X-TEST') != null) test = true;
            return response.text();
        }).then((text) => {
            if (__debug) console.log("loading page at: "+url);

            const displayedURL = urlFormatter(url);
            for (const o of LinkInterceptor.midProcesses) if (o.f(url,displayedURL,stateAction) == true) return;

            historyEdit(displayedURL,stateAction,url);

            this.eRouter.innerHTML = "";

            const template = document.createElement("template");
            template.innerHTML = text.trim();
            template.content.childNodes.forEach(cNode => {
                if (cNode.tagName == undefined) {
                    if (__debug && cNode.nodeName != "#comment") console.warn("Undefined tag: " + cNode.nodeName);
                    return;
                }

                if (cNode.tagName == "SCRIPT") {
                    var scrE = document.createElement("script");
                    scrE.innerHTML = cNode.innerHTML;
                    if (cNode.type != '') scrE.type = cNode.type;
                    scrE.async = cNode.async == true;
                    this.eRouter.appendChild(scrE);
                } else this.eRouter.appendChild(cNode);
            });

            return url;
        });
    }

    loadContent(url,stateAction=StateAction.PushState) {
        if (!this.routerActivated) { this.contentToLoadAfterEnabled = {url,stateAction}; this.pageToLoadAfterEnabled = null; return; }
        $content

        if (RouterElement.mainRouter === this) historyEdit(url,stateAction);
        this.currentURL = url;
    }

    setDefaultUrlFormatter(urlFormatter) {
        this.#urlFormatter = urlFormatter != null ? urlFormatter : function(url) {
            var res = /^(?:$rootForRegex)?\/pages\/([^?]*).*?(?:(?:\?|&)urlEnd=(.+))?$/.exec(url);
            if (res == null) {
                if (__debug) console.log('urlFormatter regex failed');
                return url;
            }

            r1 = res[1].replace(/\.h\w+$/g,'');
            const afterRoot = r1.endsWith('.php') ? r1.substr(0,r1.length-4) : r1;
            var displayedURL = `$root/\${afterRoot}`;
            if (res[2] != undefined) displayedURL += res[2].endsWith('.php') ? res[2].substr(0,res[2].length-4) : res[2];
            if (__debug) console.log(`urlFormatter: \${url} -> \${displayedURL}`);
            return displayedURL;
        };
    }

    enableRouter() {
        this.routerActivated = true;
        if (this.pageToLoadAfterEnabled != null) {
            const o = this.pageToLoadAfterEnabled;
            this.pageToLoadAfterEnabled = null;
            this.loadPage(o.url,o.stateAction,o.options);
        } else if (this.contentToLoadAfterEnabled != null) {
            const o = this.contentToLoadAfterEnabled;
            this.contentToLoadAfterEnabled = null;
            this.loadContent(o.url,o.stateAction);
        }
    }
}
customElements.define("c-router", RouterElement);
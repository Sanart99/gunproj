// Not functions

quickChannel = new BroadcastChannel('functions.js');
quickChannel.addEventListener('message',(ev) => {
    switch (ev?.data?.name) {
        case 'setNumberInTitle': setNumberInTitle(ev.data?.value??0); break;
    }
});

const StateAction = {
    None:-1,
    PushState:0,
    ReplaceState:1
}

// String functions

const _v_tpl = document.createElement("template");
function stringToNodes(s) {
    _v_tpl.innerHTML = s;
    return _v_tpl.content.cloneNode(true).childNodes;
}

function stringToJSON(s) {
    let json = null;
    try { json = JSON.parse(s); } catch (e) { }
    return json;
}

function escapeHTML(s) {
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');
}

function unescapeHTML(s) {
    return s.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#039;/g, "'");
}

// Type functions

function doubleToFloat(v) {
    return new Float32Array([v])[0];
}

function isIterable(obj) {
    if (obj == null) return false;
    return typeof obj[Symbol.iterator] === 'function';
}

function isEmpty(v) {
    return v == [] || v == null || v == undefined || v == '' || Number.isNaN(v);
}

function isObjEmpty(obj) {
    for (var prop in obj) if (Object.prototype.hasOwnProperty.call(obj, prop)) return false;
    return true
}

function isFocusable(e) {
    if (!e || (typeof e.focus) !== "function" || e.disabled) return false;

    const tabIndex = e.tabIndex??null;
    if (tabIndex !== null && parseInt(tabIndex, 10) < 0) return false;

    const style = window.getComputedStyle(e);
    if (style.display === "none" || style.visibility === "hidden" || style.opacity === "0") return false;
    if (e.offsetWidth === 0 && e.offsetHeight === 0) return false;

    if (e instanceof TextFieldElement || e instanceof CheckboxElement) return true;
    return e.matches("input, select, textarea, button, a[href], [tabindex]:not([tabindex='-1'])");
}

// Date functions

function stringDateToISO(sDate) {
    const m = /(\\d{4}-\\d\\d-\\d\\d)?(T|\\s+)?(\\d\\d:\\d\\d:\\d\\d)?\\s*(Z)?/.exec(sDate);
    const sNow = new Date().toISOString();
    const s1 = sNow.substr(0,10);
    const s2 = sNow.substr(11,8);
    let s = '';
    s += m[1] != null ? m[1] : s1;
    s += 'T';
    s += m[3] != null ? m[3] : s2;
    s += 'Z';
    return s;
}

function getDateAsString(date,lang='fr-FR') {
    const a = new Intl.DateTimeFormat('fr-FR', { dateStyle:'full', timeStyle:'long' }).format(date).split(' ');
    const a2 = [];
    a2[0] = a[0].charAt(0).toUpperCase() + a[0].slice(1);
    a2[1] = a[1];
    a2[2] = a[2].charAt(0).toUpperCase() + a[2].slice(1);
    a2[3] = a[3];
    a2[4] = a[5];
    a2[5] = a[6];
    return a2;
}

// Memory functions

const _v_testedTypes = [];

function storageAvailable(sType) {
    let storage;
    try {
        storage = window[sType];
        const x = "__storage_test__";
        storage.setItem(x, x);
        storage.removeItem(x);
        _v_testedTypes.push(sType);
        return true;
    } catch (e) {
        return false;
    }
}

let mem = [];
function memGet(key) { return mem[key]??null; }
function memSet(key,value) { return mem[key] = value; }

function sessionSet(key,value) {
    if (_v_testedTypes.indexOf("sessionStorage") != -1 || storageAvailable("sessionStorage")) {
        sessionStorage.setItem(key,value);
        return true;
    } else return false;
}

function sessionGet(key) {
    if (_v_testedTypes.indexOf("sessionStorage") != -1 || storageAvailable("sessionStorage")) {
        return sessionStorage.getItem(key);
    } else return undefined;
}

function sessionRem(key) {
    if (_v_testedTypes.indexOf("sessionStorage") != -1 || storageAvailable("sessionStorage")) {
        sessionStorage.removeItem(key);
        return true;
    } else return false;
}

function sessionRemAll(pattern) {
    if (pattern != null) {
        let toRemove = [];
        for (let i=0; i<sessionStorage.length; i++) {
            let k = sessionStorage.key(i);
            let regex = new RegExp(pattern);
            if (regex.test(k)) toRemove.push(k);
        }
        for (k of toRemove) sessionRem(k);
    } else sessionStorage.clear();
}

function localSet(key,value) {
    if (_v_testedTypes.indexOf("localStorage") != -1 || storageAvailable("localStorage")) {
        localStorage.setItem(key,value);
        return true;
    } else return false;
}

function localGet(key) {
    if (_v_testedTypes.indexOf("localStorage") != -1 || storageAvailable("localStorage")) {
        return localStorage.getItem(key);
    } else return undefined;
}

function localRem(key) {
    if (_v_testedTypes.indexOf("localStorage") != -1 || storageAvailable("localStorage")) {
        localStorage.removeItem(key);
        return true;
    } else return false;
}

function localFindKeys(pattern) {
    let a = [];
    for (let i=0; i<sessionStorage.length; i++) {
        let k = sessionStorage.key(i);
        let m = pattern.exec(k);
        if (m != null) a.push(m);
    }
    return a;
}

function getCookie(name) {
    const regex = new RegExp(`(?:^|;\\s*)${name}=([^;]*)`);
    const v = regex.exec(document.cookie);
    return v == null ? null : v[1];
}

// Browser functions

function _(s) { return document.querySelector(s); }
function _all(s) { return document.querySelectorAll(s); }

function setNumberInTitle(n,broadcast=false) {
    const m = new RegExp('^(?:\\\((\\\d+)\\\))?\\\s*(.*)$').exec(document.title);
    document.title = (n > 0 ? `(${n}) ` : '') + m[2];

    if (broadcast) quickChannel.postMessage({name:'setNumberInTitle',value:n});
}

function enableZoom(b=true) {
    if (b) document.querySelector('#meta_viewport').content = 'width=device-width, initial-scale=1.0';
    else document.querySelector('#meta_viewport').content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0';
}

function historyEdit(url,stateAction=StateAction.None,pageUrl=null) {
    switch (stateAction) {
        case StateAction.PushState: history.pushState({pageUrl:pageUrl??url}, "", url); break;
        case StateAction.ReplaceState: history.replaceState({pageUrl:pageUrl??url}, "", url); break;
        default: break;
    }
}

// Network functions

function basicQueryResultCheck(operationResult, options=null) {
    const preventNetAlert = options?.preventNetAlert === true;
    const preventThrow = options?.preventThrow === true;
    const preventAlertOnOperationFailure = options?.preventAlertOnOperationFailure === true;
    const networkFailureHandled = options?.networkFailureHandled === true;

    if (!navigator.onLine && operationResult == null) { if (!preventNetAlert) alert('No internet connection detected.'); return false; }

    if (operationResult == null) {
        alert('Unexepected error.');
        if (preventThrow != true) throw new Error('Unexepected error.');
        console.error('Unexepected error.');
        return false;
    } else if (operationResult instanceof Response && (operationResult.message === "Network error." && operationResult.status === 500)) {
        if (!networkFailureHandled) alert("Network error.");
        throw new Error('Network error.');
        return false;
    } else if (!operationResult.success) {
        if (!preventAlertOnOperationFailure) alert(operationResult.resultMessage)
        return false;
    }

    return true;
}

let loadScriptMap = new Map();
function loadScript(src, callback) {
    var srcCount = Array.isArray(src) ? src.length : 1;
    var loadingDone = 0;
    function oneDone() {
        loadingDone++;
        if (loadingDone == srcCount) {
            if (__debug) console.log("All loaded.");
            if (callback != null) callback();
        }
    }

    for (let i = 0; i < srcCount; i++) {
        const s = srcCount > 1 ? src[i] : src;

        var check = loadScriptMap.get(s);
        if (check != undefined) {
            if (__debug) console.log(`Script already loaded(${check.isLoaded}): "${s}".`);
            oneDone();
            continue;
        }

        var e = document.createElement("script");
        e.type = "text/javascript";
        e.src = s;
        document.getElementsByTagName("head")[0].appendChild(e);

        var o = { isLoaded:false };
        loadScriptMap.set(s,o);
        e.onload = function() {
            if (__debug) console.log(`Script loaded: ${s}`);
            o.isLoaded = true;
            oneDone();
        }
    }
}

let importScriptMap = new Map();
async function importScript(src, callback) {
    var srcCount = Array.isArray(src) ? src.length : 1;
    var nImported = 0;
    const result = [];
    function oneDone(module) {
        result.push(module);
        nImported++;
        if (nImported == srcCount) {
            if (__debug) console.log("All imported.");
            if (callback != null) callback(result);
        }
    }

    for (let i = 0; i < srcCount; i++) {
        const s = srcCount > 1 ? src[i] : src;

        var check = importScriptMap.get(s);
        if (check != undefined) {
            if (__debug) console.log(`Script already imported: "${s}".`);
            oneDone(check.module);
        }

        if (__debug) console.log(`Importing script: ${s}`);
        var module = await import(src);
        var o = { module:module };
        importScriptMap.set(s,o);
        oneDone(module);
    }
}

class SendQueryError extends Error { }
function sendQuery(query, variables, headers, operationName, moreOptions, moreData) {
    let options = {
        method: 'POST',
        credentials: 'include',
        ...moreOptions
    };

    if (moreData == null) {
        options.headers = headers == null ? { 'Content-Type':'application/json', 'Cache-Control':'no-cache' } : headers;
        options.body = JSON.stringify({'query':query.replace(/\s+/g, ' ').trim(), 'variables':variables, 'operationName':operationName});
    } else {
        const data = new FormData();
        data.append('gqlQuery',JSON.stringify({'query':query}));
        if (variables != null) data.append('gqlVariables',JSON.stringify(variables));
        if (operationName != null) data.append('gqlOperationName',operationName);
        for (const k in moreData) data.append(k,moreData[k]);

        options.headers = headers == null ? { 'Cache-Control':'no-cache' } : headers;
        options.body = data;
    }

    return fetch("$graphql",options).then((res) => {
        if (!res.ok) throw new SendQueryError("Couldn't connect to the server.");
        else return res.json();
    });
}
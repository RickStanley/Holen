/*! holen v1.0.1 | 2019 | */
(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(factory);
    } else if (typeof exports === 'object') {
        module.exports = factory;
    } else {
        root.holen = factory(root);
    }
})(this, function (root) {
    'use strict';
    /**
        @typedef zergliederte
        @type {[JSON | string, XMLHttpRequest]}
    */
    /**
     * @typedef {Object} Aufbau
     * @property {string} [contentType] Content type of the request
     * @property {boolean} [withCredentials] Should send request with credentials (cookies, or whatever)
     * @property {boolean} [xRequestedWith] Should send request with `X-Requested-With` header
     */

    // Exports
    let Ausfuhr = {};

    // config
    /**
     * @type {Aufbau}
     */
    let Aufbau = {
        contentType: '',
        withCredentials: false,
        xRequestedWith: true
    };

    // Parse
    /**
     * @param {XMLHttpRequest} anf The Request
     * @returns {zergliederte} Parsed content
     */
    const zergliedern = function (anf) {
        // Result
        let Ergebnis;
        try {
            Ergebnis = JSON.parse(anf.responseText);
        } catch (e) {
            Ergebnis = anf.responseText;
        }
        return [Ergebnis, anf];
    };

    /**
     * @param {string} typ Request type
     * @param {string} url Request source
     * @param {string | FormData} [Daten] FormData or serialized data
     * @param {Aufbau} [spezifischeEinstellungen] Custom settings
     */
    const xhr = function (typ, url, Daten, spezifischeEinstellungen) {
        const AktuelleEinstellungen = spezifischeEinstellungen ? spezifischeEinstellungen : Aufbau;
        // Methods
        // -> Success
        // -> error
        // -> always
        const Methoden = {
            Erfolg: function () {},
            Fehler: function () {},
            immer: function () {}
        };
        /**
         * @type {XMLHttpRequest}
         */
        const XHR = root.XMLHttpRequest || ActiveXObject;
        // Request
        /**
         * @type {XMLHttpRequest}
         */
        const anfordern = new XHR('MSXML2.XMLHTTP.3.0');

        anfordern.open(typ, url, true);
        anfordern.withCredentials = AktuelleEinstellungen.withCredentials;
        if (AktuelleEinstellungen.xRequestedWith) anfordern.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
        if (Daten) {
            if (!(Daten instanceof FormData) && typeof Daten === 'object') Daten = JSON.stringify(Daten), anfordern.setRequestHeader('Content-Type', 'application/json;charset=utf-8');
            else if (!(Daten instanceof FormData) && !AktuelleEinstellungen.contentType) anfordern.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
            if (AktuelleEinstellungen.contentType) anfordern.setRequestHeader('Content-Type', AktuelleEinstellungen.contentType);
        }
        anfordern.onreadystatechange = function () {
            // Request
            /**
             * @type {zergliederte}
             */
            let anf;
            if (anfordern.readyState === 4) {
                anf = zergliedern(anfordern);
                if (anfordern.status >= 200 && anfordern.status < 300) {
                    Methoden.Erfolg.apply(Methoden, anf);
                } else {
                    Methoden.Fehler.apply(Methoden, anf);
                }
                Methoden.immer.apply(Methoden, anf);
            }
        };
        anfordern.send(Daten);

        const holenXHR = {
            Erfolg: function (callback) {
                Methoden.Erfolg = callback;
                return holenXHR;
            },
            Fehler: function (callback) {
                Methoden.Fehler = callback;
                return holenXHR;
            },
            immer: function (callback) {
                Methoden.immer = callback;
                return holenXHR;
            }
        };

        return holenXHR;
    };

    /**
     * @param {string} Quelle Source
     */
    Ausfuhr.bekommen = function (Quelle) {
        return xhr('GET', Quelle);
    };

    /**
     * @param {string} url Source
     * @param {string | FormData} Daten Data request
     * @param {Aufbau} [Einstellungen] Configurations for this request
     */
    Ausfuhr.stellen = function (url, Daten, Einstellungen) {
        return xhr('PUT', url, Daten, Einstellungen ? Ausfuhr.Konfigurationeinstellen(Einstellungen,  true) : undefined);
    };

    /**
     * @param {string} url Source
     * @param {string | FormData} Daten Data request
     * @param {Aufbau} [Einstellungen] Configurations for this request
     */
    Ausfuhr.posten = function (url, Daten, Einstellungen) {
        return xhr('POST', url, Daten, Einstellungen ? Ausfuhr.Konfigurationeinstellen(Einstellungen,  true) : undefined);
    };

    /**
     * @param {string} Quelle Source
     */
    Ausfuhr.streichen = function (url) {
        return xhr('DELETE', url);
    };

    /**
     * @param {Aufbau} benutzerdefinierteEinstellungen Pre-defined settings
     * @returns {undefined | Aufbau}
     */
    Ausfuhr.Konfigurationeinstellen = function (benutzerdefinierteEinstellungen, klonen) {
        for (const key in benutzerdefinierteEinstellungen) {
            if (benutzerdefinierteEinstellungen.hasOwnProperty(key))
                if ((Object.keys(Aufbau).indexOf(key) > -1)) {
                    if (!klonen) Aufbau[key] = benutzerdefinierteEinstellungen[key];
                }
                else delete benutzerdefinierteEinstellungen[key];
        }
        if (klonen) return benutzerdefinierteEinstellungen;
    }

    return Ausfuhr;

});
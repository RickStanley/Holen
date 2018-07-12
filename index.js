/*! holen v1.0.0 | 2018 | */
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

    // Exports
    var Ausfuhr = {};

    // config
    var Aufbau = {
        contentType: '',
        withCredentials: false
    };

    // Parse
    /**
     * @param {XMLHttpRequest} anf The Request
     * @returns {zergliederte} Parsed content
     */
    var zergliedern = function (anf) {
        // Result
        var Ergebnis;
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
     * @param {string | FormData} Daten FormData or serialized data
     */
    var xhr = function (typ, url, Daten) {
        // Methods
        // -> Success
        // -> error
        // -> always
        var Methoden = {
            Erfolg: function () {},
            Fehler: function () {},
            immer: function () {}
        };
        /**
         * @type {XMLHttpRequest}
         */
        var XHR = root.XMLHttpRequest || ActiveXObject;
        // Request
        /**
         * @type {XMLHttpRequest}
         */
        var anfordern = new XHR('MSXML2.XMLHTTP.3.0');

        anfordern.open(typ, url, true);
        anfordern.withCredentials = Aufbau.withCredentials;
        if (Daten) {
            anfordern.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
            if (!(Daten instanceof FormData) && !Aufbau.contentType) anfordern.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        }
        anfordern.onreadystatechange = function () {
            // Request
            /**
             * @type {zergliederte}
             */
            var anf;
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

        var holenXHR = {
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
     */
    Ausfuhr.stellen = function (url, Daten) {
        return xhr('PUT', url, Daten);
    };

    /**
     * @param {string} url Source
     * @param {string | FormData} Daten Data request
     */
    Ausfuhr.posten = function (url, Daten) {
        return xhr('POST', url, Daten);
    };

    /**
     * @param {string} Quelle Source
     */
    Ausfuhr.streichen = function (url) {
        return xhr('DELETE', url);
    };

    /**
     * @param {{withCredentials: !boolean, contentType: !string}} Objekt Pre-defined settings
     */
    Ausfuhr.Konfigurationeinstellen = function (Objekt) {
        var form = new FormData();
        console.log(form)
        console.log(form instanceof FormData)
        for (var key in Objekt) {
            if (Objekt.hasOwnProperty(key)) {
                if (Object.keys(Aufbau).indexOf(key) > -1) {
                    Aufbau[key] = Objekt[key];
                }
            }
        }
    }

    return Ausfuhr;

});
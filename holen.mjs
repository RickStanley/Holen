/**
 * @callback RückrufAnfordern
 * @param {JSON | string} response
 * @param {XMLHttpRequest} request
 */

/**
 * @callback Fortschritt
 * @param {ProgressEvent<EventTarget>} ev Progress
 */

/**
 * @typedef {Object} Aufbau
 * @property {string} [contentType] Content type of the request
 * @property {boolean} [withCredentials] Should send request with credentials (cookies, or whatever)
 * @property {boolean} [xRequestedWith] Should send request with `X-Requested-With` header
 * @property {Fortschritt} [onProgress] On progress callback
 */

/**
	@typedef zergliederte
	@type {[JSON | string, XMLHttpRequest]}
*/

/**
 * @param {XMLHttpRequest} anf The Request
 * @returns Parsed content
 */
function zergliedern(anf) {
	// Result
	/**@type {JSON | string} */
	let Ergebnis;
	try {
		Ergebnis = JSON.parse(anf.responseText);
	} catch {
		Ergebnis = anf.responseText;
	}
	return [Ergebnis, anf];
}
/**
 * @param {string} Anfragetyp Request type
 * @param {string} Quelle Request source
 * @param {string | FormData} [Daten] FormData or serialized data
 * @param {Aufbau} AktuelleEinstellungen Custom settings
 */
function xhr(Anfragetyp, Quelle, Daten, AktuelleEinstellungen) {
	// Methods
	// -> Success
	// -> error
	// -> always
	const Methoden = {
		Erfolg: function () { },
		Fehler: function () { },
		immer: function () { }
	};
	/**
	 * @type {XMLHttpRequest}
	 */
	const XHR = XMLHttpRequest || ActiveXObject;
	// Request
	/**
	 * @type {XMLHttpRequest}
	 */
	const anfordern = new XHR('MSXML2.XMLHTTP.3.0');

	anfordern.open(Anfragetyp, Quelle, true);
	anfordern.withCredentials = AktuelleEinstellungen.withCredentials;
	if (AktuelleEinstellungen.xRequestedWith) anfordern.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
	if (Daten) {
		if (!(Daten instanceof FormData) && typeof Daten === 'object') {
			Daten = JSON.stringify(Daten);
			anfordern.setRequestHeader('Content-Type', 'application/json;charset=utf-8');
		} else if (!(Daten instanceof FormData) && !AktuelleEinstellungen.contentType) anfordern.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
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
	if (anfordern.upload && AktuelleEinstellungen.onProgress) anfordern.upload.onprogress = AktuelleEinstellungen.onProgress;
	anfordern.send(Daten);

	const holenXHR = {
		/**@param {RückrufAnfordern} callback */
		Erfolg: function (callback) {
			Methoden.Erfolg = callback;
			return holenXHR;
		},
		/**@param {RückrufAnfordern} callback */
		Fehler: function (callback) {
			Methoden.Fehler = callback;
			return holenXHR;
		},
		/**@param {RückrufAnfordern} callback */
		immer: function (callback) {
			Methoden.immer = callback;
			return holenXHR;
		}
	};

	return holenXHR;
}

/**
 * @callback Fortschritt
 * @param {ProgressEvent<EventTarget>} ev Progress
 */

/**
 * @typedef {Object} Aufbau
 * @property {string} [contentType] Content type of the request
 * @property {boolean} [withCredentials] Should send request with credentials (cookies, or whatever)
 * @property {boolean} [xRequestedWith] Should send request with `X-Requested-With` header
 * @property {Fortschritt} [onProgress] On progress callback
 */

/**@var {Aufbau} */
let Aufbau = {
	contentType: '',
	withCredentials: false,
	xRequestedWith: true,
	onProgress: null
};

class Holen {
	constructor(benutzerdefinierteEinstellungen = {}) {
		Holen.Konfigurationeinstellen(benutzerdefinierteEinstellungen);
	}

	/**
	@param {string} Quelle Source
	*/
	static bekommen(Quelle) {
		return xhr('GET', Quelle, null, Aufbau);
	}

	/**
	 * @param {string} Quelle Source
	 * @param {string | FormData} Daten Data request
	 * @param {Aufbau} [Einstellungen] Configurations for this request
	 */
	static stellen(Quelle, Daten, Einstellungen) {
		return xhr('PUT', Quelle, Daten, Einstellungen ? Holen.Konfigurationeinstellen(Einstellungen, true) : Aufbau);
	}

	/**
	 * @param {string} Quelle Source
	 * @param {string | FormData} Daten Data request
	 * @param {Aufbau} [Einstellungen] Configurations for this request
	 */
	static posten(Quelle, Daten, Einstellungen) {
		return xhr('POST', Quelle, Daten, Einstellungen ? Holen.Konfigurationeinstellen(Einstellungen, true) : Aufbau);
	}

	/**
	 * @param {string} Quelle Source
	 */
	static streichen(Quelle) {
		return xhr('DELETE', Quelle, null, Aufbau);
	}

	/**
	 * @param {Aufbau} benutzerdefinierteEinstellungen Pre-defined settings
	 * @param {boolean} [klonen] Should clone?
	 * @returns {undefined | Aufbau}
	 */
	static Konfigurationeinstellen(benutzerdefinierteEinstellungen, klonen = false) {
		for (const key in benutzerdefinierteEinstellungen) {
			if (benutzerdefinierteEinstellungen.hasOwnProperty(key))
				if ((Object.keys(Aufbau).indexOf(key) > -1)) {
					if (!klonen) Aufbau[key] = benutzerdefinierteEinstellungen[key];
				}
				else delete benutzerdefinierteEinstellungen[key];
		}
		if (klonen) return benutzerdefinierteEinstellungen;
	}

}

export default Holen;

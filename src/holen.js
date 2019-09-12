import { xhr } from "./core/xhr.js";

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

export default class Holen {
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
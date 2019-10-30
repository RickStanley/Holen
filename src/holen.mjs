import xhr from "./core/xhr.mjs";

/**
 * @callback Fortschritt
 * @param {ProgressEvent<EventTarget>} ev Progress
 */

/**
 * @typedef {Object} Aufbau
 * @property {string} [Inhaltstyp] Content type of the request
 * @property {boolean} [mitZeugnisse] Should send request with credentials (cookies, or whatever)
 * @property {boolean} [xAngefordertMit] Should send request with `X-Requested-With` header
 * @property {Fortschritt} [inArbeit] On progress callback
 */

/**
 * Das ist Holen.
 * @class
 */
export default class Holen {
  static Aufbau = {
    Inhaltstyp: "",
    mitZeugnisse: false,
    xAngefordertMit: true,
    inArbeit: null
  };

  constructor() {
    throw new Error("Sollte nicht instanziiert Holen.");
  }

  /**
  @param {string} Quelle Source
  */
  static bekommen(Quelle) {
    return xhr("GET", Quelle, null, Holen.Aufbau);
  }

  /**
   * @param {string} Quelle Source
   * @param {string | FormData} Daten Data request
   * @param {Aufbau} [Einstellungen] Configurations for this request
   */
  static stellen(Quelle, Daten, Einstellungen) {
    return xhr(
      "PUT",
      Quelle,
      Daten,
      Einstellungen
        ? Holen.Konfigurationeinstellen(Einstellungen, true)
        : Holen.Aufbau
    );
  }

  /**
   * @param {string} Quelle Source
   * @param {string | FormData} Daten Data request
   * @param {Aufbau} [Einstellungen] Configurations for this request
   */
  static posten(Quelle, Daten, Einstellungen) {
    return xhr(
      "POST",
      Quelle,
      Daten,
      Einstellungen
        ? Holen.Konfigurationeinstellen(Einstellungen, true)
        : Holen.Aufbau
    );
  }

  /**
   * @param {string} Quelle Source
   */
  static streichen(Quelle) {
    return xhr("DELETE", Quelle, null, Holen.Aufbau);
  }

  /**
   * @param {Aufbau} benutzerdefinierteEinstellungen Pre-defined settings
   * @param {boolean} [klonen] Should clone?
   * @returns {undefined | Aufbau}
   */
  static Konfigurationeinstellen(
    benutzerdefinierteEinstellungen,
    klonen = false
  ) {
    for (const key in benutzerdefinierteEinstellungen) {
      if (benutzerdefinierteEinstellungen.hasOwnProperty(key))
        if (Object.keys(Holen.Aufbau).includes(key)) {
          if (!klonen) Holen.Aufbau[key] = benutzerdefinierteEinstellungen[key];
        } else delete benutzerdefinierteEinstellungen[key];
    }
    if (klonen) return benutzerdefinierteEinstellungen;
  }
}
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
 * @property {string} [Inhaltstyp] Content type of the request
 * @property {boolean} [mitZeugnisse] Should send request with credentials (cookies, or whatever)
 * @property {boolean} [xAngefordertMit] Should send request with `X-Requested-With` header
 * @property {Fortschritt} [inArbeit] On progress callback
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
export default function xhr(Anfragetyp, Quelle, Daten, AktuelleEinstellungen) {
  // Methods
  // -> Success
  // -> error
  // -> always
  const Methoden = {
    Erfolg: function() {},
    Fehler: function() {},
    immer: function() {}
  };
  /**
   * @type {XMLHttpRequest}
   */
  const XHR = XMLHttpRequest || ActiveXObject;
  // Request
  /**
   * @type {XMLHttpRequest}
   */
  const anfordern = new XHR("MSXML2.XMLHTTP.3.0");

  anfordern.open(Anfragetyp, Quelle, true);
  anfordern.withCredentials = AktuelleEinstellungen.mitZeugnisse;
  if (AktuelleEinstellungen.xAngefordertMit)
    anfordern.setRequestHeader("X-Requested-With", "XMLHttpRequest");
  if (Daten) {
    if (!(Daten instanceof FormData) && typeof Daten === "object") {
      Daten = JSON.stringify(Daten);
      anfordern.setRequestHeader(
        "Content-Type",
        "application/json;charset=utf-8"
      );
    } else if (
      !(Daten instanceof FormData) &&
      !AktuelleEinstellungen.Inhaltstyp
    )
      anfordern.setRequestHeader(
        "Content-Type",
        "application/x-www-form-urlencoded"
      );
    if (AktuelleEinstellungen.Inhaltstyp)
      anfordern.setRequestHeader(
        "Content-Type",
        AktuelleEinstellungen.Inhaltstyp
      );
  }
  anfordern.onreadystatechange = () => {
    if (anfordern.readyState === 4) {
      /**
       * @type {zergliederte}
       */
      let anf = zergliedern(anfordern);
      if (anfordern.status >= 200 && anfordern.status < 300) {
        Methoden.Erfolg.apply(Methoden, [...anf]);
      } else {
        Methoden.Fehler.apply(Methoden, [...anf]);
      }
      Methoden.immer.apply(Methoden, [...anf]);
      anf = null;
    }
  };
  if (anfordern.upload && AktuelleEinstellungen.inArbeit)
    anfordern.upload.onprogress = AktuelleEinstellungen.inArbeit;
  anfordern.send(Daten);

  const holenXHR = {
    /**@param {RückrufAnfordern} callback */
    Erfolg: callback => {
      Methoden.Erfolg = callback;
      return holenXHR;
    },
    /**@param {RückrufAnfordern} callback */
    Fehler: callback => {
      Methoden.Fehler = callback;
      return holenXHR;
    },
    /**@param {RückrufAnfordern} callback */
    immer: callback => {
      Methoden.immer = callback;
      return holenXHR;
    }
  };

  return holenXHR;
}

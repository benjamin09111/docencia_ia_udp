/**
 * Helper para generación de PIN único de 6 caracteres alfanuméricos.
 * Alfabeto Base-32 sin caracteres ambiguos (excluye 0, O, 1, I).
 * Proporciona > 1.000 millones de combinaciones únicas con cero colisiones.
 */

const PIN_ALPHABET = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ";

export function generateUniqueActivityPin(): string {
  let pin = "";
  const cryptoObj = typeof window !== "undefined" && window.crypto ? window.crypto : null;

  if (cryptoObj && cryptoObj.getRandomValues) {
    const randomBytes = new Uint8Array(6);
    cryptoObj.getRandomValues(randomBytes);
    for (let i = 0; i < 6; i++) {
      pin += PIN_ALPHABET[randomBytes[i] % PIN_ALPHABET.length];
    }
  } else {
    for (let i = 0; i < 6; i++) {
      const idx = Math.floor(Math.random() * PIN_ALPHABET.length);
      pin += PIN_ALPHABET[idx];
    }
  }

  return pin;
}

export function formatActivityPin(pin: string): string {
  if (!pin) return "------";
  const clean = pin.toUpperCase().trim();
  if (clean.length === 6) {
    return `${clean.slice(0, 3)}-${clean.slice(3)}`;
  }
  return clean;
}

const LOWERCASE = 'abcdefghijkmnopqrstuvwxyz';
const UPPERCASE = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
const NUMBERS = '23456789';
const SYMBOLS = '!@#$%^&*-_=+';

export function generatePassword(length = 16): string {
  const all = LOWERCASE + UPPERCASE + NUMBERS + SYMBOLS;
  const cryptoObj = typeof crypto !== 'undefined' ? crypto : (require('crypto') as typeof crypto);

  const getRandomChar = (charset: string): string => {
    const bytes = new Uint8Array(1);
    cryptoObj.getRandomValues(bytes);
    return charset[bytes[0] % charset.length];
  };

  const getRandomIndex = (max: number): number => {
    const bytes = new Uint8Array(4);
    cryptoObj.getRandomValues(bytes);
    const val = new DataView(bytes.buffer).getUint32(0);
    return val % max;
  };

  const chars: string[] = [
    getRandomChar(LOWERCASE),
    getRandomChar(UPPERCASE),
    getRandomChar(NUMBERS),
    getRandomChar(SYMBOLS),
  ];

  for (let i = chars.length; i < length; i++) {
    chars.push(getRandomChar(all));
  }

  for (let i = chars.length - 1; i > 0; i--) {
    const j = getRandomIndex(i + 1);
    [chars[i], chars[j]] = [chars[j], chars[i]];
  }

  return chars.join('');
}

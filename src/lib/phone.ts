// Nigeria-focused phone parsing & validation.
// Accepts: 08012345678, 8012345678, +2348012345678, 2348012345678, with spaces/dashes.
// Returns canonical E.164 (+234XXXXXXXXXX) or null if invalid.

const NG_CC = "234";
// Valid NG mobile prefixes after country code (first 3 digits of the 10-digit national number)
const NG_MOBILE_PREFIXES = [
  "701","702","703","704","705","706","707","708","709",
  "801","802","803","804","805","806","807","808","809",
  "810","811","812","813","814","815","816","817","818","819",
  "901","902","903","904","905","906","907","908","909",
  "911","912","913","915","916","917","918",
];

export function normalizeNigeriaPhone(input: string): string | null {
  if (!input) return null;
  // Strip everything except digits and leading +
  const cleaned = input.trim().replace(/[\s\-().]/g, "");
  let digits = cleaned.startsWith("+") ? cleaned.slice(1) : cleaned;
  if (!/^\d+$/.test(digits)) return null;

  if (digits.startsWith("00")) digits = digits.slice(2); // 00234...
  if (digits.startsWith(NG_CC)) {
    // already +234... → expect 13 digits total (234 + 10)
    if (digits.length !== 13) return null;
  } else if (digits.startsWith("0")) {
    // local 0XXXXXXXXXX → 11 digits
    if (digits.length !== 11) return null;
    digits = NG_CC + digits.slice(1);
  } else if (digits.length === 10) {
    // bare 10-digit national
    digits = NG_CC + digits;
  } else {
    return null;
  }

  const national = digits.slice(3); // 10 digits
  const prefix = national.slice(0, 3);
  if (!NG_MOBILE_PREFIXES.includes(prefix)) return null;

  return "+" + digits;
}

export function formatNigeriaPhoneDisplay(e164: string): string {
  // +2348012345678 → +234 801 234 5678
  if (!e164.startsWith("+234") || e164.length !== 14) return e164;
  return `+234 ${e164.slice(4, 7)} ${e164.slice(7, 10)} ${e164.slice(10)}`;
}

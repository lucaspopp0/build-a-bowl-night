// Normalizes a typed phone number to a canonical key: the national number as digits only, with any country code removed.
// Returns null when the input is not a plausible phone number (at least 7 digits).
export function normalizePhone(input: string): string | null {
  // Drop spaces, dashes, dots, parentheses and any leading plus, keeping only digits.
  const digits = input.replace(/\D/g, "");

  // Reject numbers that are too short or too long to be real.
  if (digits.length < 7 || digits.length > 15) {
    return null;
  }

  // Strip a country code by keeping only the last 10 digits of longer numbers.
  return digits.length > 10 ? digits.slice(-10) : digits;
}

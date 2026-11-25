// Normalizes a typed phone number to a canonical key: digits with an optional leading "+".
// Returns null when the input is not a plausible phone number (7 to 15 digits).
export function normalizePhone(input: string): string | null {
  // Drop spaces, dashes, dots and parentheses, keeping only digits and a possible leading plus.
  const trimmed = input.trim();
  const digits = trimmed.replace(/\D/g, "");

  // Reject numbers that are too short or too long to be real.
  if (digits.length < 7 || digits.length > 15) {
    return null;
  }

  // Keep an international prefix if the user typed one.
  return trimmed.startsWith("+") ? `+${digits}` : digits;
}

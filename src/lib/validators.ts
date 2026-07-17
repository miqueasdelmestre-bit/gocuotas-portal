const CUIT_MULTIPLIERS = [5, 4, 3, 2, 7, 6, 5, 4, 3, 2];

/** Acepta CUIT con o sin guiones (ej: 20-12345678-9 ó 20123456789) y valida el dígito verificador. */
export function isValidCuit(rawValue: string): boolean {
  const digits = rawValue.replace(/\D/g, "");

  if (digits.length !== 11) return false;

  const checkDigit = Number(digits[10]);
  const sum = CUIT_MULTIPLIERS.reduce(
    (acc, multiplier, index) => acc + multiplier * Number(digits[index]),
    0,
  );

  const remainder = 11 - (sum % 11);
  const expectedCheckDigit = remainder === 11 ? 0 : remainder === 10 ? 9 : remainder;

  return checkDigit === expectedCheckDigit;
}

export function formatCuit(rawValue: string): string {
  const digits = rawValue.replace(/\D/g, "").slice(0, 11);

  if (digits.length <= 2) return digits;
  if (digits.length <= 10) return `${digits.slice(0, 2)}-${digits.slice(2)}`;

  return `${digits.slice(0, 2)}-${digits.slice(2, 10)}-${digits.slice(10)}`;
}

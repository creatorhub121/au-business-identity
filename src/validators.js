const ABN_WEIGHTS = [10, 1, 3, 5, 7, 9, 11, 13, 15, 17, 19];
const ACN_WEIGHTS = [8, 7, 6, 5, 4, 3, 2, 1];

function normalizeIdentifier(value) {
  return String(value ?? "").replace(/[\s-]/g, "");
}

function formatAbn(value) {
  return `${value.slice(0, 2)} ${value.slice(2, 5)} ${value.slice(
    5,
    8
  )} ${value.slice(8, 11)}`;
}

function formatAcn(value) {
  return `${value.slice(0, 3)} ${value.slice(3, 6)} ${value.slice(6, 9)}`;
}

export function validateAbn(input) {
  const normalized = normalizeIdentifier(input);
  const validFormat = /^\d{11}$/.test(normalized);

  if (!validFormat) {
    return {
      identifier_type: "ABN",
      input,
      normalized,
      valid_format: false,
      checksum_valid: false,
      valid: false,
      reason: "ABN must contain exactly 11 digits.",
      verification_scope:
        "Checksum validation only. This does not confirm that the ABN is registered or active.",
    };
  }

  const digits = normalized.split("").map(Number);

  // Official ABN checksum method:
  // subtract 1 from the first digit, multiply by the prescribed weights,
  // then the weighted total must be divisible by 89.
  digits[0] -= 1;

  const total = digits.reduce(
    (sum, digit, index) => sum + digit * ABN_WEIGHTS[index],
    0
  );

  const checksumValid = total % 89 === 0;

  return {
    identifier_type: "ABN",
    input,
    normalized,
    formatted: formatAbn(normalized),
    valid_format: true,
    checksum_valid: checksumValid,
    valid: checksumValid,
    reason: checksumValid
      ? "ABN format and checksum are valid."
      : "ABN checksum is invalid.",
    verification_scope:
      "Checksum validation only. This does not confirm that the ABN is registered or active.",
  };
}

export function validateAcn(input) {
  const normalized = normalizeIdentifier(input);
  const validFormat = /^\d{9}$/.test(normalized);

  if (!validFormat) {
    return {
      identifier_type: "ACN",
      input,
      normalized,
      valid_format: false,
      checksum_valid: false,
      valid: false,
      reason: "ACN must contain exactly 9 digits.",
      verification_scope:
        "Checksum validation only. This does not confirm that the ACN is registered or active.",
    };
  }

  const digits = normalized.split("").map(Number);

  const weightedTotal = ACN_WEIGHTS.reduce(
    (sum, weight, index) => sum + digits[index] * weight,
    0
  );

  const expectedCheckDigit = (10 - (weightedTotal % 10)) % 10;
  const actualCheckDigit = digits[8];
  const checksumValid = expectedCheckDigit === actualCheckDigit;

  return {
    identifier_type: "ACN",
    input,
    normalized,
    formatted: formatAcn(normalized),
    valid_format: true,
    checksum_valid: checksumValid,
    valid: checksumValid,
    reason: checksumValid
      ? "ACN format and checksum are valid."
      : "ACN checksum is invalid.",
    verification_scope:
      "Checksum validation only. This does not confirm that the ACN is registered or active.",
  };
}

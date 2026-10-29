export const formatPhone = (value: string) => {
  let digits = value.replace(/\D/g, "");

  if (digits.startsWith("8")) {
    digits = `7${digits.slice(1)}`;
  } else if (digits && !digits.startsWith("7")) {
    digits = `7${digits}`;
  }

  digits = digits.slice(0, 11);

  let formatted = "+7";

  if (digits.length > 1) {
    formatted += ` (${digits.slice(1, 4)}`;
  }

  if (digits.length >= 5) {
    formatted += `) ${digits.slice(4, 7)}`;
  }

  if (digits.length >= 8) {
    formatted += `-${digits.slice(7, 9)}`;
  }

  if (digits.length >= 10) {
    formatted += `-${digits.slice(9, 11)}`;
  }

  return { digits, formatted };
};

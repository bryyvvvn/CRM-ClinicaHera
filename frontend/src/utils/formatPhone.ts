export function formatChileanPhone(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  const nationalNumber =
    digits.length === 11 && digits.startsWith('56')
      ? digits.slice(2)
      : digits.length === 9
        ? digits
        : null;

  if (!nationalNumber?.startsWith('9')) {
    return phone;
  }

  return `+56 ${nationalNumber.slice(0, 1)} ${nationalNumber.slice(1, 5)} ${nationalNumber.slice(5)}`;
}

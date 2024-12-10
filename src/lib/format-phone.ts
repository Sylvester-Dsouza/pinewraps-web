export const formatPhoneNumber = (input: string | undefined | null) => {
  if (!input) return '';

  // Remove all non-digit characters
  let cleaned = input.replace(/\D/g, '');

  // Remove any leading zeros
  cleaned = cleaned.replace(/^0+/, '');

  // Remove any instances of the country code if present
  cleaned = cleaned.replace(/^971/, '');

  // Limit to 9 digits
  cleaned = cleaned.slice(0, 9);

  return cleaned;
};

export const getFullPhoneNumber = (phone: string) => {
  // Just return the formatted number without country code
  return formatPhoneNumber(phone);
};

export const validatePhone = (phone: string) => {
  // UAE mobile number format: should start with 50, 51, 52, 54, 55, 56, or 58
  // and be followed by 7 digits
  const phoneRegex = /^(50|51|52|54|55|56|58)\d{7}$/;
  return phoneRegex.test(formatPhoneNumber(phone));
};

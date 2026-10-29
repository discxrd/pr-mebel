export function getDynamicWhatsAppUrl(phone: string): string {
  const cleanPhone = phone.replace(/\D/g, "");
  return `https://wa.me/${cleanPhone}`;
}

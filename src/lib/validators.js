// Telefon girişinden sadece rakam, boşluk, +, (), - bırak
export function sanitizePhoneInput(value) {
  return value.replace(/[^\d\s()+-]/g, "");
}

// Türkiye telefon numarası geçerli mi? (mobil veya sabit, 10 haneli yerel)
export function isValidTurkishPhone(value) {
  let d = (value || "").replace(/\D/g, "");
  if (d.startsWith("90")) d = d.slice(2);
  if (d.startsWith("0")) d = d.slice(1);
  return d.length === 10;
}

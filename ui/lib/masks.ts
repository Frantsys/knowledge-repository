// Telefone brasileiro enquanto digita: (00) 0000-0000 com 10 dígitos (fixo) ou (00) 00000-0000 com 11 (celular)
export function maskPhone(value: string) {
  let digits = value.replace(/\D/g, "");
  // Número colado com código do país (+55 11 98765-4321): descarta o 55
  if (digits.length > 11 && digits.startsWith("55")) digits = digits.slice(2);
  digits = digits.slice(0, 11);

  if (digits.length <= 2) return digits.replace(/^(\d{1,2})/, "($1");
  if (digits.length <= 6) return digits.replace(/^(\d{2})(\d+)/, "($1) $2");
  if (digits.length <= 10) return digits.replace(/^(\d{2})(\d{4})(\d+)/, "($1) $2-$3");
  return digits.replace(/^(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
}

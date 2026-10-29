export default function getDeviceType(
  userAgent: string,
): "Телефон" | "Планшет" | "ПК" {
  const ua = userAgent.toLowerCase();

  if (/mobile|iphone|ipod|android.*mobile|blackberry|windows phone/.test(ua)) {
    return "Телефон";
  }

  if (/ipad|android(?!.*mobile)|tablet/.test(ua)) {
    return "Планшет";
  }

  return "ПК";
}

export function passwordPolicyError(password: string, identifier: string): string | null {
  if (password.length < 14 || password.length > 128) return "La contraseña debe tener entre 14 y 128 caracteres.";
  if (!/[a-z]/.test(password) || !/[A-Z]/.test(password) || !/\d/.test(password) || !/[^A-Za-z0-9]/.test(password)) {
    return "Usa mayúscula, minúscula, número y símbolo.";
  }
  if (/\s/.test(password)) return "La contraseña no puede contener espacios.";
  const local = identifier.split("@")[0]?.toLowerCase() || "";
  if (local.length >= 3 && password.toLowerCase().includes(local)) return "La contraseña no puede contener tu usuario.";
  return null;
}

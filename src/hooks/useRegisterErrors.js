export function parseRegisterError(err) {
  const msg = err?.response?.data?.message;

  if (!msg) return { general: "Unexpected error" };

  if (msg === "Email already in use") return { email: msg };
  if (msg === "Username already in use") return { username: msg };

  return { general: msg };
}

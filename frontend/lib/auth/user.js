import { jwtDecode } from "jwt-decode";

export function getUserFromToken(token) {
  if (!token) return null;

  try {
    const decoded = jwtDecode(token);

    return {
      id: decoded.sub,
      email: decoded.email,
      name: decoded.name,
    };
  } catch {
    return null;
  }
}

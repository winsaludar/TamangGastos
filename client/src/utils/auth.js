import { setCookie } from "nookies";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function login(email, password) {
  try {
    const response = await fetch(`${BASE_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const { message } = await response.json();
      throw new Error(message);
    }

    const { data } = await response.json();

    setCookie(null, "token", data.token, {
      maxAge: 60 * 60 * 24, // 1 day
      path: "/", // Make cookie available site-wide
      secure: process.env.NODE_ENV === "production", // Only send cookies over HTTPS in production
      sameSite: "Strict", // Prevent CSRF
    });

    return { isSuccessful: true, token: data.token, error: null };
  } catch (err) {
    return { isSuccessful: false, error: err.message, token: null };
  }
}

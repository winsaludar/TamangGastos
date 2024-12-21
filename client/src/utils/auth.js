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
    return { isSuccessful: false, token: null, error: err.message };
  }
}

export async function register(username, email, password, retypePassword) {
  try {
    const response = await fetch(`${BASE_URL}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: username,
        email: email,
        password: password,
        retypePassword: retypePassword,
      }),
    });

    if (!response.ok) {
      const { details } = await response.json();
      throw new Error(details.join(", "));
    }

    const { message } = await response.json();

    return { isSuccessful: true, message };
  } catch (err) {
    return { isSuccessful: false, message: err.message };
  }
}

export async function validateEmail(email, token) {
  try {
    const response = await fetch(`${BASE_URL}/api/auth/validate-email`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email, token: token }),
    });
    const body = await response.json();

    if (!response.ok) {
      throw new Error(body.message);
    }

    return { isSuccessful: true, message: body.message };
  } catch (err) {
    return { isSuccessful: false, message: err.message };
  }
}

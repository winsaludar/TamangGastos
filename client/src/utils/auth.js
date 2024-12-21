import { setCookie } from "nookies";
import { stringify } from "postcss";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function login(email, password) {
  try {
    const endpoint = `${BASE_URL}/${process.env.NEXT_PUBLIC_API_LOGIN}`;
    const response = await fetch(endpoint, {
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
    const endpoint = `${BASE_URL}/${process.env.NEXT_PUBLIC_API_REGISTER}`;
    const response = await fetch(endpoint, {
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
    const endpoint = `${BASE_URL}/${process.env.NEXT_PUBLIC_API_VALIDATE_EMAIL}`;
    const response = await fetch(endpoint, {
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

export async function resendEmailConfirmation(email) {
  try {
    const endpoint = `${BASE_URL}/${process.env.NEXT_PUBLIC_API_RESEND_EMAIL_CONFIRMATION}`;
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
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

export async function forgotPassword(email) {
  try {
    const endpoint = `${BASE_URL}/${process.env.NEXT_PUBLIC_API_FORGOT_PASSWORD}`;
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
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

export async function resetPassword(email, token, password, retypePassword) {
  try {
    console.log(email, token, password, retypePassword);
    const endpoint = `${BASE_URL}/${process.env.NEXT_PUBLIC_API_RESET_PASSWORD}`;
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, token, password, retypePassword }),
    });
    const body = await response.json();

    if (!response.ok) {
      const message = body.details ? body.details.join(", ") : body.message;
      throw new Error(message);
    }

    return { isSuccessful: true, message: body.message };
  } catch (err) {
    return { isSuccessful: false, message: err.message };
  }
}

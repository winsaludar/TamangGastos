"use client";

import Link from "next/link";
import { forgotPassword } from "@/utils/auth.js";
import { useState } from "react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [response, setResponse] = useState(null);

  const handleSend = async function (e) {
    e.preventDefault();
    setResponse(null);

    const res = await forgotPassword(email);

    if (!res.isSuccessful) {
      setResponse({ ...res });
      return;
    }

    setResponse({
      ...res,
      message: "An email has been sent! Please check your inbox/spam folder",
    });
    setEmail("");
  };

  return (
    <>
      <section
        className={`relative w-full text-center px-4 py-3 rounded relative mb-16 ${
          response
            ? response.isSuccessful
              ? "bg-green-100 border border-green-400 text-green-700"
              : "bg-red-100 border border-red-400 text-red-700"
            : ""
        }`}
        role="alert"
      >
        {response && (
          <>
            <strong className="font-bold">
              {!response.isSuccessful ? "Error: " : ""}{" "}
            </strong>
            <span className="block sm:inline">{response.message}</span>
          </>
        )}
      </section>

      <h1 className="text-2xl xl:text-3xl font-extrabold text-center">
        Forgot your password
      </h1>

      <form className="w-full mx-auto mt-12" onSubmit={handleSend}>
        <input
          className="w-full px-8 py-4 -lg font-medium border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button
          className="mt-5 tracking-wide font-semibold bg-orange-500 text-gray-100 w-full py-4 rounded-lg hover:bg-orange-700 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none"
          type="submit"
        >
          <span className="ml-3">Send</span>
        </button>
      </form>

      <div className="my-12 text-sm text-center">
        <p className="text-gray-600">
          <Link
            href="/register"
            className="inline-block px-4 py-2 form-semibold hover:text-orange-500 transition-all duration-300 ease-in-out focus:shadow-outline focus:outline-none"
          >
            No account yet? Register now
          </Link>
        </p>
        <p className="text-gray-600">
          <Link
            href="/login"
            className="inline-block px-4 py-2 form-semibold hover:text-orange-500 transition-all duration-300 ease-in-out focus:shadow-outline focus:outline-none"
          >
            Done changing your password? Login here
          </Link>
        </p>
      </div>
    </>
  );
}

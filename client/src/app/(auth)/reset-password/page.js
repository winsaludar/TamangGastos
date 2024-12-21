"use client";

import Link from "next/link";
import { resetPassword } from "@/utils/auth.js";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const defaultData = {
    email: searchParams.get("email"),
    token: searchParams.get("token"),
    password: "",
    retypePassword: "",
  };
  const [formData, setFormData] = useState(defaultData);
  const [response, setResponse] = useState(null);

  const handleReset = async function (e) {
    e.preventDefault();
    setResponse(defaultData);

    const res = await resetPassword(
      formData.email,
      formData.token,
      formData.password,
      formData.retypePassword
    );

    if (!res.isSuccessful) {
      setResponse({ ...res });
      return;
    }

    setResponse({
      ...res,
      message:
        "Reset password successful! You may now login using your new password",
    });
    setFormData({ ...defaultData });
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
        Reset your password
      </h1>

      <form className="w-full mx-auto mt-12" onSubmit={handleReset}>
        <input
          className="w-full px-8 py-4 -lg font-medium border bg-gray-100 border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-gray-100 cursor-default"
          type="email"
          placeholder="Email"
          value={formData.email}
          required
          readOnly
        />
        <input
          className="w-full px-8 py-4 -lg font-medium border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white mt-5"
          type="Password"
          placeholder="Password"
          value={formData.password}
          onChange={(e) =>
            setFormData({ ...formData, password: e.target.value })
          }
          required
        />
        <input
          className="w-full px-8 py-4 -lg font-medium border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white mt-5"
          type="Password"
          placeholder="Re-type Password"
          value={formData.retypePassword}
          onChange={(e) =>
            setFormData({ ...formData, retypePassword: e.target.value })
          }
          required
        />
        <button
          className="mt-5 tracking-wide font-semibold bg-orange-500 text-gray-100 w-full py-4 rounded-lg hover:bg-orange-700 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none"
          type="submit"
        >
          <span className="ml-3">Reset</span>
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

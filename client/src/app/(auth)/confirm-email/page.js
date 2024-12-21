import Link from "next/link";
import { validateEmail } from "@/utils/auth.js";

export default async function ConfirmEmailPage({ searchParams }) {
  const contactUs = process.env.NEXT_PUBLIC_CONTACT_US;
  const { email, token } = await searchParams;

  let headerText;
  let subText;
  let colorClass;
  let buttonName;
  let buttonLink;

  // Validate in our backend
  const response = await validateEmail(email, token);
  console.log(response);
  const hasError = !response.isSuccessful;

  if (hasError) {
    headerText = "Invalid validation link!";
    subText = "Please request a new validation link.";
    colorClass = "red";
    buttonName = "Request Email Confirmation Link";
    buttonLink = "/request-email-confirmation";
  } else {
    headerText = "Email Confirmed!";
    subText = "You can now use your email address to login.";
    colorClass = "green";
    buttonName = "Return to Login";
    buttonLink = "/login";
  }

  return (
    <>
      <div className="flex flex-col items-center justify-center w-full max-w-2xl text-center mx-auto">
        <div
          className={`flex items-center justify-center w-24 h-24 mx-auto mb-8 bg-${colorClass}-100 rounded-full`}
        >
          <svg
            className={`w-12 h-12 text-${colorClass}-600`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d={!hasError ? "M5 13l4 4L19 7" : "M6 18L18 6M6 6l12 12"}
            ></path>
          </svg>
        </div>

        <h1 className={`mb-8 text-4xl font-extrabold text-${colorClass}-500`}>
          {headerText}
        </h1>

        <div className="p-6 rounded-lg">
          <p className="text-lg font-medium text-black">{subText}</p>
        </div>

        <div className="pt-8 border-t border-gray-100">
          <p className="text-lg text-gray-700">
            Have questions? Contact us at:
          </p>
          <a
            href={`mailto: ${contactUs}`}
            className="inline-block mt-2 text-xl font-medium text-blue-600 transition-colors duration-200 hover:text-blue-800"
          >
            {contactUs}
          </a>
        </div>

        <div className="mt-12">
          <Link
            href={buttonLink}
            className={`inline-block px-8 py-4 text-lg font-semibold text-white transition-colors duration-200 bg-${colorClass}-600 rounded-lg hover:bg-${colorClass}-700`}
          >
            {buttonName}
          </Link>
        </div>
      </div>
    </>
  );
}

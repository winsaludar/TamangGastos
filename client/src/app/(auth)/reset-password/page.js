import ResetPasswordForm from "./ResetPasswordForm.js";
import { redirect } from "next/navigation";

export default function ResetPasswordPage({ searchParams }) {
  const email = searchParams["email"];
  const token = searchParams["token"];

  if (!email || !token) {
    redirect("/login");
  }

  return <ResetPasswordForm email={email} token={token} />;
}

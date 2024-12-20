import "../../styles/globals.css";

import Image from "next/image";

export const metadata = {
  title: "Tamang Gastos",
  description:
    "Simplify your financial life with an all-in-one solution for managing budgets, tracking expenses, and planning for the future",
};

export default function AuthLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <main className="min-h-screen bg-gray-900 text-gray-900 flex justify-center">
          <section className="max-w-screen-xl m-0 sm:m-10 shadow sm:rounded-lg flex justify-center flex-1 bg-gray-100">
            <article className="lg:w-1/2 xl:w-5/12 p-6 sm:p-12">
              <section className="mt-12 flex flex-col items-center">
                {children}
              </section>
            </article>

            <aside className="flex-1 text-center hidden lg:flex">
              <div
                className="w-full bg-cover bg-center bg-no-repeat"
                style={{
                  backgroundImage: "url('/login-placeholder.jpg')",
                }}
              ></div>
            </aside>
          </section>
        </main>
      </body>
    </html>
  );
}

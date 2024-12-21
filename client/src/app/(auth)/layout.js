import "../../styles/globals.css";

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
            {children}
          </section>
        </main>
      </body>
    </html>
  );
}

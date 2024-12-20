import "../../styles/globals.css";

import Footer from "../../components/Footer.js";
import Header from "../../components/Header.js";

export const metadata = {
  title: "Tamang Gastos",
  description:
    "Simplify your financial life with an all-in-one solution for managing budgets, tracking expenses, and planning for the future",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Header title={metadata.title} />
        <main className="container mx-auto p-6">{children}</main>
        <Footer title={metadata.title} />
      </body>
    </html>
  );
}

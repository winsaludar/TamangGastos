export const metadata = {
  title: "Tamang Gastos",
  description:
    "Simplify your financial life with an all-in-one solution for managing budgets, tracking expenses, and planning for the future",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

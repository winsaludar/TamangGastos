export const metadata = {
  title: "Forgot Password - Tamang Gastos",
};

export default function ForgotPasswordLayout({ children }) {
  return (
    <>
      <article className="lg:w-1/2 xl:w-5/12 p-6 sm:p-12">
        <section className="mt-12 flex flex-col items-center">
          {children}
        </section>
      </article>

      <aside className="flex-1 text-center hidden lg:flex">
        <div
          className="w-full bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('/forgot-placeholder.jpg')",
          }}
        ></div>
      </aside>
    </>
  );
}

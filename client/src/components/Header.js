import MainNav from "./MainNav.js";

export default function Header({ title }) {
  return (
    <header>
      <div className="mx-auto sm:px-7 px-4 max-w-screen-xl py-10">
        <MainNav title={title} />
      </div>
    </header>
  );
}

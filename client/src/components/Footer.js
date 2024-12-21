export default function Footer({ title }) {
  return (
    <footer className="bg-gray-800 text-white p-4 text-center">
      @ {new Date().getFullYear()} - {title}
    </footer>
  );
}

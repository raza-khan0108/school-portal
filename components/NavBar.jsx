import Link from "next/link";

export default function NavBar() {
  return (
    <header className="w-full border-b bg-white">
      <nav className="mx-auto max-w-5xl flex items-center justify-between p-4">
        <Link href="/" className="font-semibold text-xl">School Portal</Link>
        <div className="flex gap-4">
          <Link href="/addSchool" className="px-3 py-1 rounded-lg hover:bg-gray-100">Add School</Link>
          <Link href="/showSchools" className="px-3 py-1 rounded-lg hover:bg-gray-100">Show Schools</Link>
        </div>
      </nav>
    </header>
  );
}

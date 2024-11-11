import Link from "next/link";
import { Trophy } from "lucide-react";
export default function Header() {
  return (
    <header className="px-4 lg:px-6 h-14 flex items-center">
      <Link className="flex items-center justify-center" href="/">
        <Trophy className="h-10 w-10" />
        <h1 style={{ fontSize: "40px", fontWeight: "bolder" }}>Tournify</h1>
        <span className="sr-only">Tournament Generator</span>
      </Link>
      <nav className="ml-auto flex gap-4 sm:gap-6">
        <Link
          className="text-sm font-medium hover:underline underline-offset-4"
          href="/"
          style={{ fontSize: "20px" }}
        >
          Dashboard
        </Link>
        <Link
          className="text-sm font-medium hover:underline underline-offset-4"
          href="/tour_list"
          style={{ fontSize: "20px" }}
        >
          Tournaments
        </Link>
        <Link
          className="text-sm font-medium hover:underline underline-offset-4"
          href="#"
          style={{ fontSize: "20px" }}
        >
          Settings
        </Link>
      </nav>
    </header>
  );
}

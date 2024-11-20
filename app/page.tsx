// pages/index.tsx
import Navbar from "@/components/ui/Navbar";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <Navbar />

      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 text-gray-800 p-6">
        <h1 className="text-4xl font-bold mb-4">Robinos Admin Dashboard</h1>
        <p className="text-lg mb-8">
          Manage records for players, events, tokens, chains and categories.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl">
          <Link
            href="/players"
            className="bg-white shadow-lg rounded-lg p-6 transition transform hover:scale-105 hover:bg-blue-100"
          >
            <h2 className="text-2xl font-semibold mb-2">Players &rarr;</h2>
            <p>View and manage player records.</p>
          </Link>

          <Link
            href="/events"
            className="bg-white shadow-lg rounded-lg p-6 transition transform hover:scale-105 hover:bg-blue-100"
          >
            <h2 className="text-2xl font-semibold mb-2">Events &rarr;</h2>
            <p>View and manage event records.</p>
          </Link>

          <Link
            href="/tokens"
            className="bg-white shadow-lg rounded-lg p-6 transition transform hover:scale-105 hover:bg-blue-100"
          >
            <h2 className="text-2xl font-semibold mb-2">Tokens &rarr;</h2>
            <p>View and manage token records.</p>
          </Link>

          <Link
            href="/chains"
            className="bg-white shadow-lg rounded-lg p-6 transition transform hover:scale-105 hover:bg-blue-100"
          >
            <h2 className="text-2xl font-semibold mb-2">Chains &rarr;</h2>
            <p>View and manage chain records.</p>
          </Link>

          <Link
            href="/category"
            className="bg-white shadow-lg rounded-lg p-6 transition transform hover:scale-105 hover:bg-blue-100"
          >
            <h2 className="text-2xl font-semibold mb-2">Categories &rarr;</h2>
            <p>View and manage category records.</p>
          </Link>
        </div>
      </div>
    </>
  );
}

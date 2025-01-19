"use client"
// pages/index.tsx
import Navbar from "@/components/dashboard/ui/Navbar";
import Link from "next/link";
import { useSession, signIn } from "next-auth/react";
import { getAdminList } from "@/components/dashboard/hooks/adminList.js";
import { useEffect, useState } from "react";

export default function Home() {
  const { data: session } = useSession()
  const [adminList, setAdminList] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    getAdminList().then(data => {
      if (data) {
        const temp: string[] = [];
        data.forEach(item => {
          temp.push(item.email);
        });
        setAdminList(temp);;
      }
    }).finally(() => {
      setLoading(false);
    });
  }, []);


  if (loading) {
    return (
      <main className="flex justify-center items-center h-screen">
        <div className="loader"></div>
      </main>
    )
  }

  if (!session) {
    return (
      <div className="h-screen flex flex-col justify-center items-center gap-4">
        <h1>Login with GitHub</h1>
        <button
          onClick={() => signIn("github")}
          className="border py-1 px-2 border-black w-1/4 hover:bg-black hover:text-white transition text-xl"
        >
          Login
        </button>
      </div>
    )
  }

  if (session && session.user?.email && !adminList.includes(session.user?.email)) {
    return (
      <div className="h-screen flex flex-col justify-center items-center gap-4">
        <h1>Sorry! You are not an Authenticated User</h1>
        <p className="text-xl">Please login with an Authenticated Account</p>
        <button
          onClick={() => signIn("github")}
          className="border py-1 px-2 border-black w-1/4 hover:bg-black hover:text-white transition text-xl"
        >
          Login
        </button>
      </div>
    )
  }

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
          <Link
            href="/tournaments"
            className="bg-white shadow-lg rounded-lg p-6 transition transform hover:scale-105 hover:bg-blue-100"
          >
            <h2 className="text-2xl font-semibold mb-2">Tournaments &rarr;</h2>
            <p>View and manage tournament records.</p>
          </Link>
        </div>
      </div>
    </>
  );
}

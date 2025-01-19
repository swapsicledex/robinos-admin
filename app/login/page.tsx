"use client";
import { useSession, signIn } from "next-auth/react";
import { getAdminList } from "@/components/dashboard/hooks/adminList.js";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
    const { data: session } = useSession();
    const [adminList, setAdminList] = useState<string[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const router = useRouter();

    const handleLogin = () => {
        signIn("github");
        router.replace("/");
    }

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

    if (session && session.user?.email && !adminList.includes(session.user?.email)) {
        return (
            <div className="h-screen flex flex-col justify-center items-center gap-4">
                <h1>Sorry! You are not an Authenticated User</h1>
                <p className="text-xl">Please login with an Authenticated Account</p>
                <button
                    onClick={handleLogin}
                    className="border py-1 px-2 border-black w-1/4 hover:bg-black hover:text-white transition text-xl"
                >
                    Login
                </button>
            </div>
        )
    }

    return (
        <div className="h-screen flex flex-col justify-center items-center gap-4">
            <h1>Login with GitHub</h1>
            <button
                onClick={handleLogin}
                className="border py-1 px-2 border-black w-1/4 hover:bg-black hover:text-white transition text-xl"
            >
                Login
            </button>
        </div>
    )
}
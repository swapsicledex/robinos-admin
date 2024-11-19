// components/Navbar.tsx
import Link from "next/link";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Navbar = () => {
  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <ToastContainer position="bottom-left" autoClose={3000} theme="colored" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/">
              <h1 className="text-xl font-bold text-gray-800">
                Dashboard
              </h1>
            </Link>
          </div>
          <div className="flex space-x-4">
            <Link
              href="/players"
              className="text-gray-800 hover:text-blue-600 transition duration-200"
            >
              Players
            </Link>
            <Link
              href="/events"
              className="text-gray-800 hover:text-blue-600 transition duration-200"
            >
              Events
            </Link>
            <Link
              href="/tokens"
              className="text-gray-800 hover:text-blue-600 transition duration-200"
            >
              Tokens
            </Link>
            <Link
              href="/chains"
              className="text-gray-800 hover:text-blue-600 transition duration-200"
            >
              Chains
            </Link>
            <Link
              href="/category"
              className="text-gray-800 hover:text-blue-600 transition duration-200"
            >
              Categories
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

import Link from "next/link"

export default function Home() {
  return (
      <div className="font-sans flex flex-col items-center justify-center min-h-screen  p-8 sm:p-20">
        <main className="text-center flex flex-col items-center gap-10">
          <h1 className="text-4xl sm:text-6xl font-bold text-gray-900">
            Vitaj na <span className="text-blue-600">DevMatch</span>
          </h1>

          <div className="flex gap-4 flex-wrap justify-center">
            <Link
                href="/login"
                className="bg-blue-600 hover:bg-blue-700 duration-300  transition-colors text-white px-8 py-3 rounded-xl font-medium shadow-md"
            >
              Sign In
            </Link>

            <Link
                href="/register"
                className="bg-white hover:bg-gray-100 duration-300 transition-colors text-blue-600 border border-blue-600 px-8 py-3 rounded-xl font-medium shadow-sm"
            >
              Sign Up
            </Link>
          </div>
        </main>
      </div>
  );
}

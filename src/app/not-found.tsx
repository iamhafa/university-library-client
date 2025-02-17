"use client";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 px-6">
      <h1 className="text-7xl font-extrabold text-blue-600">404</h1>
      <h2 className="mt-4 text-2xl font-semibold text-gray-800">Oops! Page Not Found</h2>
      <p className="mt-2 text-gray-600 text-lg text-center">
        The page you are looking for might have been removed or is temporarily unavailable.
      </p>
      <a
        href="/"
        className="mt-6 inline-block rounded-lg bg-blue-600 px-6 py-3 text-white font-semibold shadow-md transition duration-300 hover:bg-blue-700"
      >
        Go Back Home
      </a>
    </div>
  );
}

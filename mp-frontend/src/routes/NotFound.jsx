import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";

export default function NotFound() {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
      <div className="text-center">
        <h1 className="mb-4 text-6xl font-extrabold text-black">404</h1>

        <p className="mb-6 text-lg text-gray-600">
          Oops! The page you’re looking for doesn’t exist.
        </p>

        <Link
          to="/"
          className="inline-block rounded-xl bg-black px-6 py-3 text-white font-medium transition hover:bg-black/90"
        >
          Return to Home
        </Link>
      </div>
    </div>
  );
}

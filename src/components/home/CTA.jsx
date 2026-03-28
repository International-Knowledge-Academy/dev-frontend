import { Link } from "react-router-dom";

const CTA = () => {
  return (
    <section className="bg-gray-50 py-16 text-center px-6">
      <h2 className="text-3xl font-bold text-gray-800 mb-4">
        Ready to get started?
      </h2>
      <p className="text-gray-500 mb-8">
        Sign in to access your dashboard.
      </p>
      <Link
        to="/auth/sign-in"
        className="bg-blue-600 text-white font-semibold px-10 py-3 rounded-full hover:bg-blue-700 transition"
      >
        Sign In
      </Link>
    </section>
  );
};

export default CTA;

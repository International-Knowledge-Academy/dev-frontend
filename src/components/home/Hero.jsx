import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section className="flex flex-col items-center justify-center text-center px-6 py-24 bg-gradient-to-br from-blue-600 to-indigo-700">
      <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
        Welcome to Our Platform
      </h1>
      <p className="text-lg md:text-xl text-blue-100 max-w-2xl mb-10">
        A simple, powerful dashboard to manage your work, track your progress,
        and grow your business.
      </p>
      <div className="flex gap-4">
        <Link
          to="/auth/sign-in"
          className="bg-white text-blue-600 font-semibold px-8 py-3 rounded-full hover:bg-blue-50 transition"
        >
          Get Started
        </Link>
        <Link
          to="/about"
          className="border border-white text-white font-semibold px-8 py-3 rounded-full hover:bg-white hover:text-blue-600 transition"
        >
          Learn More
        </Link>
      </div>
    </section>
  );
};

export default Hero;

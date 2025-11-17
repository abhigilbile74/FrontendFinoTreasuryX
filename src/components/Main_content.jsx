import { Link, useNavigate } from "react-router-dom";
import RuPaySymbol from './ui/RuPaySymbol';

const Main_content = () => {
  return (
    <div className="flex flex-col justify-center items-center bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 text-center lg:w-1/2 p-4 md:p-6 lg:p-8 space-y-2 md:space-y-3 min-h-[50vh] lg:min-h-screen">
      {/* Logo Text */}
      <Link to= "/">
      <h1
        className="font-broadway text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-wide text-gray-900 dark:text-white"
        style={{ fontFamily: "'Broadway', sans-serif" }}
      >
        <span className="text-blue-600">Fino</span>_
        <span className="text-emerald-500">Treasury</span>
      </h1>
      </Link>

      {/* Tagline */}
      <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base md:text-lg font-light max-w-md px-4">
        Empowering modern finance with clarity and control
      </p>

      {/* Active Indicator */}
      <p className="text-gray-700 dark:text-gray-100 text-sm sm:text-base md:text-lg font-light max-w-md tracking-wide flex items-center justify-center gap-2 px-4">
        <span className="inline-block w-2 h-2 sm:w-3 sm:h-3 bg-emerald-500 rounded-full shadow-md animate-pulse"></span>
        <span className="font-semibold text-gray-800 dark:text-white">Fino_</span>
        <span className="text-emerald-500 dark:text-emerald-400 font-semibold">Account</span>
      </p>
    </div>
  );
};

export default Main_content;

import { Link } from "react-router-dom";
import { AlertCircle, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="max-w-md mx-auto px-4 py-16 text-center space-y-6">
      <div className="inline-flex p-4 bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 rounded-3xl animate-bounce">
        <AlertCircle className="w-12 h-12" />
      </div>
      
      <div className="space-y-2">
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          404 - Not Found
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>
      </div>

      <div className="pt-4">
        <Link
          to="/"
          className="inline-flex items-center space-x-2 px-6 py-3 font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-2xl shadow-xs transition-all cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Home Feed</span>
        </Link>
      </div>
    </div>
  );
}

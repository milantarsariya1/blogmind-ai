import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-white dark:bg-slate-950 border-t border-slate-100 dark:border-slate-900 mt-auto py-12">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-12 text-center space-y-6">
        {/* Logo Section */}
        <div className="flex items-center justify-center">
          <Link to="/" className="inline-flex items-center space-x-2">
            <span className="bg-gradient-to-r from-indigo-600 to-violet-600 dark:from-indigo-400 dark:to-violet-400 text-transparent bg-clip-text text-2xl font-extrabold tracking-tight">
              BlogMind AI
            </span>
          </Link>
        </div>

        {/* Elegant Mission Statement */}
        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xl mx-auto leading-relaxed">
          Unleash your creativity with advanced AI writing assistants, structural outlines, and instant readability calculations. Built for modern writers who value speed, elegance, and integrity.
        </p>

        {/* Policy & Support Links */}
        <div className="flex items-center justify-center space-x-6 text-xs text-slate-400 font-semibold pt-2">
          <a href="#" className="hover:text-indigo-650 dark:hover:text-indigo-450 transition-colors">Privacy Policy</a>
          <span className="w-1.5 h-1.5 rounded-full bg-slate-200 dark:bg-slate-800"></span>
          <a href="#" className="hover:text-indigo-650 dark:hover:text-indigo-450 transition-colors">Terms of Service</a>
          <span className="w-1.5 h-1.5 rounded-full bg-slate-200 dark:bg-slate-800"></span>
          <a href="mailto:support@blogmind.ai" className="hover:text-indigo-650 dark:hover:text-indigo-450 transition-colors">Contact Support</a>
        </div>

        {/* Copyright Line */}
        <div className="text-[11px] text-slate-400 dark:text-slate-550 pt-4 border-t border-slate-100 dark:border-slate-900/60 max-w-md mx-auto">
          &copy; {new Date().getFullYear()} BlogMind AI. All rights reserved. Designed for writing with integrity.
        </div>
      </div>
    </footer>
  );
}

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useBlog } from "../App";
import { User, Eye, EyeOff, Lock, Mail, ArrowRight } from "lucide-react";

export default function Signup() {
  const { login } = useBlog();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});

  const validate = () => {
    const tempErrors: typeof errors = {};
    if (!name.trim()) {
      tempErrors.name = "Full Name is required";
    }
    if (!email) {
      tempErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      tempErrors.email = "Please enter a valid email address";
    }
    if (!password) {
      tempErrors.password = "Password is required";
    } else if (password.length < 6) {
      tempErrors.password = "Password must be at least 6 characters";
    }
    if (password !== confirmPassword) {
      tempErrors.confirmPassword = "Passwords do not match";
    }
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    // Simulate account registration: create mock user, log in, redirect
    const newUser = {
      id: `user-${Date.now()}`,
      name: name.trim(),
      email: email.toLowerCase(),
    };

    login(newUser);
    navigate("/dashboard");
  };

  return (
    <div className="max-w-md mx-auto px-4 py-8">
      <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 rounded-3xl shadow-xs p-8 space-y-6 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/10 dark:bg-indigo-500/5 rounded-bl-full pointer-events-none" />

        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Create Account
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Sign up to start sharing your thoughts with AI help
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name input */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Full Name
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setErrors((prev) => ({ ...prev, name: undefined }));
                }}
                className={`w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-950 border rounded-xl text-sm outline-none transition-all ${
                  errors.name
                    ? "border-red-500 focus:ring-2 focus:ring-red-500/20"
                    : "border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-indigo-600/30 focus:border-indigo-600"
                } text-slate-700 dark:text-slate-200`}
              />
            </div>
            {errors.name && (
              <p className="text-xs font-semibold text-red-500">{errors.name}</p>
            )}
          </div>

          {/* Email input */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setErrors((prev) => ({ ...prev, email: undefined }));
                }}
                className={`w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-950 border rounded-xl text-sm outline-none transition-all ${
                  errors.email
                    ? "border-red-500 focus:ring-2 focus:ring-red-500/20"
                    : "border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-indigo-600/30 focus:border-indigo-600"
                } text-slate-700 dark:text-slate-200`}
              />
            </div>
            {errors.email && (
              <p className="text-xs font-semibold text-red-500">{errors.email}</p>
            )}
          </div>

          {/* Password input */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Minimum 6 characters"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setErrors((prev) => ({ ...prev, password: undefined }));
                }}
                className={`w-full pl-10 pr-10 py-3 bg-slate-50 dark:bg-slate-950 border rounded-xl text-sm outline-none transition-all ${
                  errors.password
                    ? "border-red-500 focus:ring-2 focus:ring-red-500/20"
                    : "border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-indigo-600/30 focus:border-indigo-600"
                } text-slate-700 dark:text-slate-200`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.password && (
              <p className="text-xs font-semibold text-red-500">{errors.password}</p>
            )}
          </div>

          {/* Confirm Password input */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Confirm Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Re-enter password"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  setErrors((prev) => ({ ...prev, confirmPassword: undefined }));
                }}
                className={`w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-950 border rounded-xl text-sm outline-none transition-all ${
                  errors.confirmPassword
                    ? "border-red-500 focus:ring-2 focus:ring-red-500/20"
                    : "border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-indigo-600/30 focus:border-indigo-600"
                } text-slate-700 dark:text-slate-200`}
              />
            </div>
            {errors.confirmPassword && (
              <p className="text-xs font-semibold text-red-500">{errors.confirmPassword}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full flex items-center justify-center space-x-2 py-3 px-4 font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 rounded-xl transition-all shadow-xs cursor-pointer"
          >
            <span>Create Account</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center pt-2">
          <p className="text-xs text-slate-500">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

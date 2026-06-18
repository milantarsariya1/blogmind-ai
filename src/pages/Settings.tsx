import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useBlog } from "../App";
import { authApi } from "../services/api";
import { User, Mail, Lock, CheckCircle, AlertCircle, Save, FileText, Loader2 } from "lucide-react";

export default function Settings() {
  const { currentUser, updateCurrentUser } = useBlog();
  
  const [name, setName] = useState(currentUser?.name || "");
  const [email, setEmail] = useState(currentUser?.email || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ name?: string; email?: string; password?: string }>({});

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
    if (newPassword && newPassword.length < 6) {
      tempErrors.password = "New password must be at least 6 characters";
    }
    if (newPassword && newPassword !== confirmNewPassword) {
      tempErrors.password = "New passwords do not match";
    }
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMsg("");
    setErrorMsg("");
    
    if (!validate()) return;

    if (newPassword && !currentPassword) {
      setErrorMsg("Please enter your current password to set a new one.");
      return;
    }

    try {
      setIsLoading(true);
      
      const payload: any = {
        name: name.trim(),
        email: email.toLowerCase(),
      };
      
      if (newPassword) {
        payload.password = newPassword;
      }

      const response = await authApi.updateProfile(payload);
      
      updateCurrentUser(response.user, response.token);
      setSuccessMsg("Settings updated successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
      
      // Clear notification after 4 seconds
      setTimeout(() => {
        setSuccessMsg("");
      }, 4000);
    } catch (error: any) {
      console.error("Failed to update profile settings:", error);
      const errMsg = error.response?.data?.error || "Failed to update profile settings. Try again.";
      setErrorMsg(errMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Title Header */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Account Settings
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Manage your profile information, password security, and publisher settings.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Left Side: Avatar Card */}
        <div className="md:col-span-4 space-y-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/60 p-6 rounded-3xl text-center space-y-4">
            <div className="relative inline-flex mx-auto">
              <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-indigo-500 to-violet-500 text-white flex items-center justify-center font-extrabold text-3xl shadow-md">
                {name.charAt(0).toUpperCase()}
              </div>
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">{name}</h3>
              <p className="text-xs text-slate-400 font-semibold">{email}</p>
            </div>
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800/60 flex flex-col space-y-1.5 text-xs text-slate-500">
              <div className="flex justify-between">
                <span>Account Role:</span>
                <span className="font-semibold text-slate-700 dark:text-slate-350">Contributor Creator</span>
              </div>
              <div className="flex justify-between pb-1">
                <span>Status:</span>
                <span className="font-semibold text-emerald-500">Active</span>
              </div>
              <Link
                to="/dashboard"
                className="w-full mt-2 flex items-center justify-center space-x-1.5 py-2 px-4 text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/40 dark:hover:bg-indigo-950/70 border border-indigo-200/20 dark:border-indigo-900/30 rounded-xl transition-all cursor-pointer text-center animate-in fade-in"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>View My Posts</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Right Side: Settings Form */}
        <div className="md:col-span-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/60 rounded-3xl p-6 md:p-8 space-y-6">
              <h3 className="text-base font-bold text-slate-900 dark:text-white border-b border-slate-150/50 dark:border-slate-800/50 pb-3">
                Personal Information
              </h3>
              
              {successMsg && (
                <div className="flex items-center space-x-2.5 p-3.5 text-xs font-semibold text-emerald-700 bg-emerald-50 dark:bg-emerald-950/20 dark:text-emerald-400 border border-emerald-250/30 dark:border-emerald-900/50 rounded-xl">
                  <CheckCircle className="w-4 h-4 shrink-0" />
                  <span>{successMsg}</span>
                </div>
              )}

              {errorMsg && (
                <div className="flex items-center space-x-2.5 p-3.5 text-xs font-semibold text-red-700 bg-red-50 dark:bg-red-950/20 dark:text-red-400 border border-red-250/30 dark:border-red-900/50 rounded-xl">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={isLoading}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:border-indigo-650 rounded-xl text-sm outline-none transition-all focus:ring-2 focus:ring-indigo-600/20 text-slate-700 dark:text-slate-200"
                    placeholder="Enter your name"
                  />
                </div>
                {errors.name && <p className="text-xs text-red-500 font-semibold">{errors.name}</p>}
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:border-indigo-650 rounded-xl text-sm outline-none transition-all focus:ring-2 focus:ring-indigo-600/20 text-slate-700 dark:text-slate-200"
                    placeholder="you@example.com"
                  />
                </div>
                {errors.email && <p className="text-xs text-red-500 font-semibold">{errors.email}</p>}
              </div>
            </div>

            {/* Password security section */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/60 rounded-3xl p-6 md:p-8 space-y-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-white border-b border-slate-150/50 dark:border-slate-800/50 pb-3">
                Security & Password
              </h3>

              {/* Current Password */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Current Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    disabled={isLoading}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:border-indigo-650 rounded-xl text-sm outline-none transition-all focus:ring-2 focus:ring-indigo-600/20 text-slate-700 dark:text-slate-200"
                    placeholder="Enter current password to set a new one"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* New Password */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    New Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      disabled={isLoading}
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:border-indigo-650 rounded-xl text-sm outline-none transition-all focus:ring-2 focus:ring-indigo-600/20 text-slate-700 dark:text-slate-200"
                      placeholder="Minimum 6 chars"
                    />
                  </div>
                </div>

                {/* Confirm Password */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="password"
                      value={confirmNewPassword}
                      onChange={(e) => setConfirmNewPassword(e.target.value)}
                      disabled={isLoading}
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:border-indigo-650 rounded-xl text-sm outline-none transition-all focus:ring-2 focus:ring-indigo-600/20 text-slate-700 dark:text-slate-200"
                      placeholder="Confirm new password"
                    />
                  </div>
                </div>
              </div>
              {errors.password && <p className="text-xs text-red-500 font-semibold">{errors.password}</p>}
            </div>

            {/* Submit Bar */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isLoading}
                className="flex items-center space-x-2 px-6 py-3 font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-2xl shadow-xs transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4.5 h-4.5 animate-spin" />
                    <span>Saving Changes...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4.5 h-4.5" />
                    <span>Save Profile Changes</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

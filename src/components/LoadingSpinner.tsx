interface LoadingSpinnerProps {
  message?: string;
  size?: "sm" | "md" | "lg";
}

export default function LoadingSpinner({ message = "Loading...", size = "md" }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "w-5 h-5 border-2",
    md: "w-8 h-8 border-3",
    lg: "w-12 h-12 border-4"
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 space-y-3">
      <div className={`animate-spin rounded-full border-indigo-600 border-t-transparent ${sizeClasses[size]}`} />
      {message && <p className="text-sm font-medium text-slate-500 dark:text-slate-400 animate-pulse">{message}</p>}
    </div>
  );
}

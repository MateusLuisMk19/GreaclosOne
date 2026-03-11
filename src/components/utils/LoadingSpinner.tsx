import React from "react";
import { useTheme } from "../../contexts/ThemeContext";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = "md",
  className = "",
}) => {
  const { isDark } = useTheme();

  const sizeClasses = {
    sm: "h-6 w-6",
    md: "h-12 w-12",
    lg: "h-16 w-16",
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className="text-center">
        <div
          className={`animate-spin rounded-full border-b-2 border-blue-600 mx-auto mb-4 ${sizeClasses[size]}`}
        />
        <p className={`text-sm ${isDark ? "text-gray-300" : "text-gray-600"}`}>
          Carregando...
        </p>
      </div>
    </div>
  );
};

export default LoadingSpinner;

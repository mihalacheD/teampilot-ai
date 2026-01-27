"use client";

import React, { forwardRef } from "react";
import { LucideIcon, AlertCircle, ChevronDown } from "lucide-react";

interface AuthSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  icon: LucideIcon;
  error?: string;
  options: { value: string; label: string }[];
}

export const AuthSelect = forwardRef<HTMLSelectElement, AuthSelectProps>(
  ({ label, icon: Icon, error, options, ...props }, ref) => {
    return (
      <div className="w-full">
        <label htmlFor={props.id} className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon className="h-5 w-5 text-gray-400" />
          </div>

          <select
            {...props}
            ref={ref}
            className={`w-full pl-10 pr-10 py-3 border rounded-xl outline-none transition-all appearance-none bg-white cursor-pointer ${error
                ? "border-red-300 focus:ring-2 focus:ring-red-200 focus:border-red-400"
                : "border-gray-300 focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
              } ${props.className}`}
          >
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>

          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <ChevronDown className="h-5 w-5 text-gray-400" />
          </div>
        </div>

        {error && (
          <p className="text-red-500 text-sm mt-1.5 flex items-center gap-1 animate-in fade-in slide-in-from-top-1">
            <AlertCircle className="w-3.5 h-3.5" />
            {error}
          </p>
        )}
      </div>
    );
  }
);

AuthSelect.displayName = "AuthSelect";
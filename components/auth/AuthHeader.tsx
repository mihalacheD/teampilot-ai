"use client";

import Link from "next/link";
import { Sparkles } from "lucide-react";

interface AuthHeaderProps {
  title: string;
  subtitle: string;
}

export function AuthHeader({ title, subtitle }: AuthHeaderProps) {
  return (
    <div className="text-center mb-8">
      <Link href="/" className="inline-flex items-center gap-2 mb-6 hover:opacity-80 transition-opacity">
        <div className="w-12 h-12 bg-linear-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
          <Sparkles className="w-6 h-6 text-white" />
        </div>
        <span className="text-2xl font-bold bg-linear-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
          TeamPilot AI
        </span>
      </Link>

      <h1 className="text-3xl font-bold text-gray-900 mb-2">{title}</h1>
      <p className="text-gray-600">{subtitle}</p>
    </div>
  );
}
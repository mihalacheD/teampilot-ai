'use client';

import { CheckCircle2, BarChart3, Users, Sparkles, ArrowRight, Zap, Eye, Shield } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

export default function LandingPage() {
  const router = useRouter();

  const handleDemoLogin = async (email: string) => {
    try {
      const result = await signIn("credentials", {
        email,
        redirect: false,
      });

      if (result?.ok) {
        router.push("/");
        router.refresh();
      }
    } catch (error) {
      console.error("Demo login failed", error);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-indigo-50">
      {/* Top Bar with Auth Links */}
      <div className="max-w-6xl mx-auto px-6 py-4">
        <div className="flex justify-end gap-3">
          <Link
            href="/auth/signin"
            className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 font-medium transition-colors"
          >
            Sign In
          </Link>
          <Link
            href="/auth/register"
            className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 font-medium transition-colors"
          >
            Register
          </Link>
        </div>
      </div>

      {/* Hero Section */}
      <div className="max-w-6xl mx-auto px-6 pt-12 pb-20">
        <div className="text-center space-y-6 mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-4">
            <Sparkles className="w-4 h-4" />
            AI-Powered Team Management
          </div>

          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight">
            Manage Your Team
            <br />
            <span className="bg-linear-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Powered by AI
            </span>
          </h1>

          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            A lightweight task management platform with role-based access and AI-powered insights.
            Perfect for small teams who want to work smarter.
          </p>
        </div>

        {/* Demo CTA - Primary Focus */}
        <div className="max-w-3xl mx-auto">
          <div className="bg-linear-to-br from-blue-600 to-indigo-600 rounded-2xl p-8 shadow-2xl border border-blue-400/20">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Eye className="w-5 h-5 text-blue-100" />
              <p className="text-sm font-semibold text-blue-100 uppercase tracking-wider">
                Try It Now - No Signup Required
              </p>
            </div>
            
            <h2 className="text-2xl md:text-3xl font-bold text-white text-center mb-3">
              Experience TeamPilot in Action
            </h2>
            
            <p className="text-blue-100 text-center mb-8 max-w-xl mx-auto">
              Explore the full platform instantly. Choose your role and see how TeamPilot 
              streamlines team collaboration and task management.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Manager Demo Button */}
              <button
                onClick={() => handleDemoLogin('manager@demo.com')}
                className="group relative bg-white hover:bg-gray-50 rounded-xl p-6 transition-all hover:scale-105 hover:shadow-xl"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-linear-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-left flex-1">
                    <h3 className="text-lg font-bold text-gray-900 mb-1">
                      Manager View
                    </h3>
                    <p className="text-sm text-gray-600 mb-3">
                      Full team oversight, task creation, and AI analytics
                    </p>
                    <div className="flex items-center gap-1 text-indigo-600 font-medium text-sm">
                      <span>Explore Dashboard</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
                <div className="absolute top-3 right-3 bg-indigo-100 text-indigo-700 text-xs font-bold px-2 py-1 rounded-full">
                  RECOMMENDED
                </div>
              </button>

              {/* Employee Demo Button */}
              <button
                onClick={() => handleDemoLogin('employee@demo.com')}
                className="group relative bg-white hover:bg-gray-50 rounded-xl p-6 transition-all hover:scale-105 hover:shadow-xl"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-linear-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                    <Zap className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-left flex-1">
                    <h3 className="text-lg font-bold text-gray-900 mb-1">
                      Employee View
                    </h3>
                    <p className="text-sm text-gray-600 mb-3">
                      Personal task management and progress tracking
                    </p>
                    <div className="flex items-center gap-1 text-emerald-600 font-medium text-sm">
                      <span>Explore Tasks</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </button>
            </div>

            <div className="mt-6 flex items-center justify-center gap-2 text-blue-100 text-sm">
              <Shield className="w-4 h-4" />
              <span>Demo mode • Read-only for data protection • No credit card needed</span>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20">
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
              <CheckCircle2 className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Task Management</h3>
            <p className="text-gray-600">
              Organize and track team tasks with an intuitive interface. Set priorities,
              deadlines, and monitor progress in real-time.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mb-4">
              <Sparkles className="w-6 h-6 text-indigo-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">AI Insights</h3>
            <p className="text-gray-600">
              Get smart summaries, workload analysis, and actionable recommendations
              powered by advanced AI technology.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
              <BarChart3 className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Team Overview</h3>
            <p className="text-gray-600">
              Monitor team performance with visual dashboards. Identify bottlenecks
              and optimize workflows effortlessly.
            </p>
          </div>
        </div>

        {/* Role-Based Access */}
        <div className="mt-20 bg-linear-to-r from-blue-600 to-indigo-600 rounded-3xl p-12 text-white">
          <h2 className="text-3xl font-bold mb-8 text-center">Built for Teams of All Sizes</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white/10 backdrop-blur rounded-2xl p-6 border border-white/20">
              <Users className="w-8 h-8 mb-4" />
              <h3 className="text-xl font-bold mb-2">For Managers</h3>
              <ul className="space-y-2 text-blue-100">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  Create and assign tasks
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  View team analytics
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  AI-powered insights
                </li>
              </ul>
            </div>

            <div className="bg-white/10 backdrop-blur rounded-2xl p-6 border border-white/20">
              <Zap className="w-8 h-8 mb-4" />
              <h3 className="text-xl font-bold mb-2">For Team Members</h3>
              <ul className="space-y-2 text-blue-100">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  Track your tasks
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  Update progress
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  Stay organized
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <p className="text-gray-600 mb-4">Ready to get started with your own team?</p>
          <Link
            href="/auth/register"
            className="inline-flex items-center gap-2 px-8 py-4 bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
          >
            Create Your Free Account
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
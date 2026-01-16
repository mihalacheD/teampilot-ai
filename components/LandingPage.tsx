import { CheckCircle2, BarChart3, Users, Sparkles, ArrowRight, Zap } from "lucide-react";
import Link from "next/link";


export default function LandingPage() {
  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-indigo-50">
      {/* Hero Section */}
      <div className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center space-y-6 mb-16">
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

          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <Link
              href="/auth/register"
              className="group px-8 py-4 bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
            >
              Get Started Free
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              href="/auth/signin"
              className="px-8 py-4 bg-white hover:bg-gray-50 text-gray-900 rounded-xl font-semibold border-2 border-gray-200 hover:border-gray-300 transition-all"
            >
              Sign In
            </Link>
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
      </div>
    </div>
  )
}


import { Link } from "react-router-dom";
import { MdArrowLeft, MdHome } from "react-icons/md";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        {/* 404 Illustration */}
        <div className="mb-8">
          <div className="relative">
            <div className="text-8xl font-bold text-gray-200 mb-4">404</div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-4xl flex items-center justify-center shadow-lg">
                <span className="text-white text-5xl">0</span>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-3">
            Page Not Found
          </h1>
          <p className="text-gray-600 mb-6 leading-relaxed">
            Oops! The page you're looking for doesn't exist. It might have been moved, deleted, or you entered the wrong URL.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/"
              className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white font-medium rounded-xl hover:from-purple-600 hover:to-blue-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <MdHome className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Link>

            <button
              onClick={() => window.history.back()}
              className="inline-flex items-center justify-center px-6 py-3 bg-white text-gray-700 font-medium rounded-xl border border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200"
            >
              <MdArrowLeft className="w-4 h-4 mr-2" />
              Go Back
            </button>
          </div>
        </div>

        {/* Quick Links */}
        <div className="text-sm text-gray-500">
          <p className="mb-3">Quick links:</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/candidates" className="hover:text-purple-500 transition-colors">
              Candidates
            </Link>
            <Link to="/jobs" className="hover:text-purple-500 transition-colors">
              Jobs
            </Link>
            <Link to="/task-meetings" className="hover:text-purple-500 transition-colors">
              Tasks & Meetings
            </Link>
            <Link to="/reports" className="hover:text-purple-500 transition-colors">
              Reports
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

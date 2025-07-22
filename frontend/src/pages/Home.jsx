import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, User, Calendar, Sparkles } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        {/* Header Section */}
        <motion.div
          className="text-center space-y-6 mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center justify-center space-x-3 mb-4">
            <Calendar className="h-12 w-12 text-purple-600" />
            <Sparkles className="h-8 w-8 text-indigo-500" />
          </div>
          <h1 className="text-5xl md:text-6xl h-20 font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
            Event Management
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Streamline your events with our comprehensive management platform. Choose your role to get started on your
            event journey.
          </p>
        </motion.div>

        {/* Role Selection Cards */}
        <motion.div
          className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {/* Admin Card */}
          <Link to="/login?role=admin">
            <motion.div
              className="group relative overflow-hidden bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer border border-gray-100"
              whileHover={{ scale: 1.02, y: -5 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-purple-600 opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
              <div className="p-8 text-center space-y-4">
                <div className="mx-auto w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center group-hover:bg-purple-200 transition-colors duration-300">
                  <Shield className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 group-hover:text-purple-600 transition-colors duration-300">
                  Admin
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Manage events, oversee operations, and control system settings with full administrative access.
                </p>
                <div className="pt-4">
                  <div className="inline-flex items-center text-purple-600 font-semibold group-hover:text-purple-700 transition-colors duration-300">
                    Get Started
                    <motion.span
                      className="ml-2"
                      animate={{ x: [0, 4, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      →
                    </motion.span>
                  </div>
                </div>
              </div>
            </motion.div>
          </Link>

          {/* User Card */}
          <Link to="/login?role=user">
            <motion.div
              className="group relative overflow-hidden bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer border border-gray-100"
              whileHover={{ scale: 1.02, y: -5 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-indigo-600 opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
              <div className="p-8 text-center space-y-4">
                <div className="mx-auto w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center group-hover:bg-indigo-200 transition-colors duration-300">
                  <User className="h-8 w-8 text-indigo-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 group-hover:text-indigo-600 transition-colors duration-300">
                  User
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Browse events, register for activities, and manage your personal event schedule and preferences.
                </p>
                <div className="pt-4">
                  <div className="inline-flex items-center text-indigo-600 font-semibold group-hover:text-indigo-700 transition-colors duration-300">
                    Get Started
                    <motion.span
                      className="ml-2"
                      animate={{ x: [0, 4, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      →
                    </motion.span>
                  </div>
                </div>
              </div>
            </motion.div>
          </Link>
        </motion.div>

        {/* Footer */}
        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <p className="text-gray-500 text-sm">Secure • Reliable • Easy to Use</p>
        </motion.div>
      </div>
    </div>
  );
}

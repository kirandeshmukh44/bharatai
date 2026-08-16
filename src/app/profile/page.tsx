'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  User,
  Mail,
  Building2,
  Shield,
  Save,
  Camera
} from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';

export default function ProfilePage() {
  const [formData, setFormData] = useState({
    name: 'Admin User',
    email: 'admin@bharatai.demo',
    organization: 'BharatAI Technologies',
    role: 'Admin'
  });

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white">Profile</h2>
        <p className="text-slate-400">Manage your account settings</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-2xl p-6 border border-slate-800"
        >
          <div className="text-center">
            <div className="relative inline-block">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl font-bold text-white">AU</span>
              </div>
              <button className="absolute bottom-0 right-0 p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white border border-slate-700">
                <Camera className="w-4 h-4" />
              </button>
            </div>
            <h3 className="text-xl font-bold text-white">{formData.name}</h3>
            <p className="text-slate-400">{formData.email}</p>
            <div className="mt-4 inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/30">
              <Shield className="w-4 h-4 text-blue-400" />
              <span className="text-sm text-blue-400">{formData.role}</span>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Organization</span>
              <span className="text-white">{formData.organization}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Member Since</span>
              <span className="text-white">Jan 2024</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Last Login</span>
              <span className="text-white">Today</span>
            </div>
          </div>
        </motion.div>

        {/* Edit Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-2 glass-card rounded-2xl p-6 border border-slate-800"
        >
          <h3 className="text-lg font-semibold text-white mb-6">Edit Profile</h3>
          
          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="input-field w-full pl-12 pr-4 py-3 rounded-xl text-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="input-field w-full pl-12 pr-4 py-3 rounded-xl text-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Organization
                </label>
                <div className="relative">
                  <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                  <input
                    type="text"
                    value={formData.organization}
                    onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                    className="input-field w-full pl-12 pr-4 py-3 rounded-xl text-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Role
                </label>
                <input
                  type="text"
                  value={formData.role}
                  disabled
                  className="input-field w-full px-4 py-3 rounded-xl text-slate-400 bg-slate-800/50 cursor-not-allowed"
                />
              </div>
            </div>

            <div className="pt-6 border-t border-slate-800">
              <button
                type="button"
                className="btn-primary px-6 py-3 rounded-xl text-white font-medium flex items-center space-x-2"
              >
                <Save className="w-5 h-5" />
                <span>Save Changes</span>
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}

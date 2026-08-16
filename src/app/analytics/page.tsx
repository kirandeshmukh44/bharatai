'use client';

import { motion } from 'framer-motion';
import {
  TrendingUp,
  BarChart3,
  PieChart,
  Activity,
  Calendar,
  Download,
  Filter
} from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { cn } from '@/lib/utils';

export default function AnalyticsPage() {
  return (
    <DashboardLayout>
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white">Analytics</h2>
          <p className="text-slate-400">Detailed insights and reports</p>
        </div>
        <div className="flex gap-3">
          <button className="btn-secondary px-4 py-2 rounded-lg text-white font-medium flex items-center space-x-2">
            <Calendar className="w-4 h-4" />
            <span>Last 30 Days</span>
          </button>
          <button className="btn-primary px-4 py-2 rounded-lg text-white font-medium flex items-center space-x-2">
            <Download className="w-4 h-4" />
            <span>Export Report</span>
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {[
          { label: 'Total Assessments', value: '342', change: '+12%', icon: Activity },
          { label: 'Avg Risk Score', value: '74.2', change: '+2.3%', icon: TrendingUp },
          { label: 'Verified Entities', value: '156', change: '+8%', icon: BarChart3 },
          { label: 'Pending Reviews', value: '24', change: '-5%', icon: PieChart },
        ].map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="glass-card rounded-2xl p-6 border border-slate-800"
          >
            <div className="flex items-center justify-between mb-4">
              <stat.icon className="w-6 h-6 text-blue-400" />
              <span className={cn(
                "text-sm font-medium",
                stat.change.startsWith('+') ? 'text-green-400' : 'text-red-400'
              )}>
                {stat.change}
              </span>
            </div>
            <p className="text-3xl font-bold text-white">{stat.value}</p>
            <p className="text-sm text-slate-400 mt-1">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Charts Placeholder */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card rounded-2xl p-6 border border-slate-800 h-80 flex items-center justify-center">
          <div className="text-center">
            <BarChart3 className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <p className="text-slate-400">Risk Score Distribution Chart</p>
          </div>
        </div>
        <div className="glass-card rounded-2xl p-6 border border-slate-800 h-80 flex items-center justify-center">
          <div className="text-center">
            <TrendingUp className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <p className="text-slate-400">Verification Trends Chart</p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

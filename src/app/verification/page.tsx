'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  FileCheck,
  Building2,
  Cpu,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  ChevronRight,
  Search,
  Plus,
  Eye
} from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { cn, getStatusColor } from '@/lib/utils';
import { demoVerificationRequests } from '@/lib/demo-data';

const steps = [
  { number: 1, title: 'Select Entity', description: 'Choose supplier or component' },
  { number: 2, title: 'Review Info', description: 'Verify submitted information' },
  { number: 3, title: 'Check Documents', description: 'Review required documentation' },
  { number: 4, title: 'Run Validation', description: 'Execute validation checks' },
  { number: 5, title: 'AI Analysis', description: 'Run AI risk analysis' },
  { number: 6, title: 'Generate Report', description: 'Create verification report' },
];

export default function VerificationPage() {
  const [activeStep, setActiveStep] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredRequests = demoVerificationRequests.filter(req => 
    req.entity_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white">Verification</h2>
          <p className="text-slate-400">Manage verification workflows and requests</p>
        </div>
        <button className="btn-primary px-6 py-3 rounded-xl text-white font-medium flex items-center justify-center space-x-2">
          <Plus className="w-5 h-5" />
          <span>New Request</span>
        </button>
      </div>

      {/* Verification Workflow */}
      <div className="glass-card rounded-2xl p-6 border border-slate-800 mb-6">
        <h3 className="text-lg font-semibold text-white mb-6">Verification Workflow</h3>
        <div className="relative">
          <div className="absolute top-8 left-0 right-0 h-0.5 bg-slate-800 hidden lg:block" />
          <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
            {steps.map((step) => (
              <button
                key={step.number}
                onClick={() => setActiveStep(step.number)}
                className={cn(
                  "relative flex flex-col items-center text-center p-4 rounded-xl transition-all",
                  activeStep === step.number
                    ? 'bg-blue-500/10 border border-blue-500/30'
                    : activeStep > step.number
                    ? 'bg-green-500/10 border border-green-500/30'
                    : 'bg-slate-800/50 border border-slate-700'
                )}
              >
                <div className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold mb-3 z-10",
                  activeStep === step.number
                    ? 'bg-blue-500 text-white'
                    : activeStep > step.number
                    ? 'bg-green-500 text-white'
                    : 'bg-slate-700 text-slate-400'
                )}>
                  {activeStep > step.number ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    step.number
                  )}
                </div>
                <p className={cn(
                  "text-sm font-medium",
                  activeStep >= step.number ? 'text-white' : 'text-slate-400'
                )}>
                  {step.title}
                </p>
                <p className="text-xs text-slate-500 mt-1">{step.description}</p>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Verification Requests */}
      <div className="glass-card rounded-2xl border border-slate-800 overflow-hidden">
        <div className="p-6 border-b border-slate-800">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <h3 className="text-lg font-semibold text-white">Verification Requests</h3>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search requests..."
                className="input-field pl-12 pr-4 py-2 rounded-xl text-white placeholder-slate-500 focus:outline-none w-full lg:w-64"
              />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-900/80">
                <th className="text-left py-4 px-6 text-xs font-semibold text-slate-400 uppercase tracking-wider">Entity</th>
                <th className="text-left py-4 px-6 text-xs font-semibold text-slate-400 uppercase tracking-wider">Type</th>
                <th className="text-left py-4 px-6 text-xs font-semibold text-slate-400 uppercase tracking-wider">Priority</th>
                <th className="text-left py-4 px-6 text-xs font-semibold text-slate-400 uppercase tracking-wider">Status</th>
                <th className="text-left py-4 px-6 text-xs font-semibold text-slate-400 uppercase tracking-wider">Created</th>
                <th className="text-left py-4 px-6 text-xs font-semibold text-slate-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filteredRequests.map((request, index) => (
                <motion.tr
                  key={request.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="hover:bg-slate-800/50 transition-colors"
                >
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-500/30 flex items-center justify-center">
                        {request.request_type.includes('supplier') ? (
                          <Building2 className="w-5 h-5 text-blue-400" />
                        ) : (
                          <Cpu className="w-5 h-5 text-purple-400" />
                        )}
                      </div>
                      <div>
                        <p className="text-white font-medium">{request.entity_name}</p>
                        <p className="text-sm text-slate-500 capitalize">{request.request_type.replace('_', ' ')}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-slate-300 capitalize">{request.request_type.replace('_', ' ')}</span>
                  </td>
                  <td className="py-4 px-6">
                    <span className={cn(
                      "px-3 py-1 rounded-full text-xs font-medium",
                      request.priority === 'high' ? 'bg-red-500/10 text-red-400 border border-red-500/30' :
                      request.priority === 'normal' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/30' :
                      'bg-slate-500/10 text-slate-400 border border-slate-500/30'
                    )}>
                      {request.priority}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span className={cn(
                      "px-3 py-1 rounded-full text-xs font-medium flex items-center space-x-1 w-fit",
                      request.status === 'verified' ? 'bg-green-500/10 text-green-400 border border-green-500/30' :
                      request.status === 'pending' ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/30' :
                      request.status === 'requires_review' ? 'bg-orange-500/10 text-orange-400 border border-orange-500/30' :
                      'bg-red-500/10 text-red-400 border border-red-500/30'
                    )}>
                      {request.status === 'verified' && <CheckCircle className="w-3 h-3" />}
                      {request.status === 'pending' && <Clock className="w-3 h-3" />}
                      {request.status === 'requires_review' && <AlertCircle className="w-3 h-3" />}
                      {request.status === 'rejected' && <XCircle className="w-3 h-3" />}
                      <span className="capitalize">{request.status.replace('_', ' ')}</span>
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-slate-400">
                      {new Date(request.created_at).toLocaleDateString('en-IN')}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <button className="p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-all">
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Verification Status Guide */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
        {[
          { status: 'Verified', description: 'All checks passed', color: 'green' },
          { status: 'Partially Verified', description: 'Some checks pending', color: 'blue' },
          { status: 'Unverified', description: 'Awaiting verification', color: 'slate' },
          { status: 'Requires Review', description: 'Manual review needed', color: 'orange' },
        ].map((item) => (
          <div key={item.status} className="glass-card rounded-xl p-4 border border-slate-800">
            <div className={cn(
              "w-3 h-3 rounded-full mb-2",
              item.color === 'green' && 'bg-green-500',
              item.color === 'blue' && 'bg-blue-500',
              item.color === 'slate' && 'bg-slate-500',
              item.color === 'orange' && 'bg-orange-500',
            )} />
            <p className="text-white font-medium text-sm">{item.status}</p>
            <p className="text-slate-400 text-xs">{item.description}</p>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
}

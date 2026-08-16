'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Search,
  Filter,
  Plus,
  MoreHorizontal,
  Building2,
  MapPin,
  Shield,
  AlertTriangle,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Eye,
  Edit,
  Activity,
  FileCheck
} from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { cn, getRiskColor, getStatusColor } from '@/lib/utils';
import { demoSuppliers } from '@/lib/demo-data';

export default function SuppliersPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [riskFilter, setRiskFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);

  const filteredSuppliers = demoSuppliers.filter(supplier => {
    const matchesSearch = supplier.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         supplier.country.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRisk = riskFilter === 'all' || supplier.risk_level.toLowerCase() === riskFilter;
    const matchesStatus = statusFilter === 'all' || supplier.verification_status === statusFilter;
    return matchesSearch && matchesRisk && matchesStatus;
  });

  const itemsPerPage = 5;
  const totalPages = Math.ceil(filteredSuppliers.length / itemsPerPage);
  const paginatedSuppliers = filteredSuppliers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white">Suppliers</h2>
          <p className="text-slate-400">Manage and verify your supply chain partners</p>
        </div>
        <button className="btn-primary px-6 py-3 rounded-xl text-white font-medium flex items-center justify-center space-x-2">
          <Plus className="w-5 h-5" />
          <span>Add Supplier</span>
        </button>
      </div>

      {/* Filters */}
      <div className="glass-card rounded-2xl p-4 mb-6 border border-slate-800">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search suppliers by name or country..."
              className="input-field w-full pl-12 pr-4 py-3 rounded-xl text-white placeholder-slate-500 focus:outline-none"
            />
          </div>
          <div className="flex gap-4">
            <select
              value={riskFilter}
              onChange={(e) => setRiskFilter(e.target.value)}
              className="input-field px-4 py-3 rounded-xl text-white focus:outline-none min-w-[140px]"
            >
              <option value="all">All Risk Levels</option>
              <option value="low">Low Risk</option>
              <option value="medium">Medium Risk</option>
              <option value="high">High Risk</option>
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="input-field px-4 py-3 rounded-xl text-white focus:outline-none min-w-[140px]"
            >
              <option value="all">All Status</option>
              <option value="verified">Verified</option>
              <option value="partially_verified">Partially Verified</option>
              <option value="unverified">Unverified</option>
            </select>
          </div>
        </div>
      </div>

      {/* Suppliers Table */}
      <div className="glass-card rounded-2xl border border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-900/80">
                <th className="text-left py-4 px-6 text-xs font-semibold text-slate-400 uppercase tracking-wider">Supplier</th>
                <th className="text-left py-4 px-6 text-xs font-semibold text-slate-400 uppercase tracking-wider">Location</th>
                <th className="text-left py-4 px-6 text-xs font-semibold text-slate-400 uppercase tracking-wider">Industry</th>
                <th className="text-left py-4 px-6 text-xs font-semibold text-slate-400 uppercase tracking-wider">Components</th>
                <th className="text-left py-4 px-6 text-xs font-semibold text-slate-400 uppercase tracking-wider">Status</th>
                <th className="text-left py-4 px-6 text-xs font-semibold text-slate-400 uppercase tracking-wider">Risk</th>
                <th className="text-left py-4 px-6 text-xs font-semibold text-slate-400 uppercase tracking-wider">Trust Score</th>
                <th className="text-left py-4 px-6 text-xs font-semibold text-slate-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {paginatedSuppliers.map((supplier, index) => (
                <motion.tr
                  key={supplier.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="hover:bg-slate-800/50 transition-colors"
                >
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-500/30 flex items-center justify-center">
                        <Building2 className="w-5 h-5 text-blue-400" />
                      </div>
                      <div>
                        <p className="text-white font-medium">{supplier.name}</p>
                        <p className="text-sm text-slate-500">{supplier.registration_id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-2 text-slate-400">
                      <MapPin className="w-4 h-4" />
                      <span>{supplier.city}, {supplier.country}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-slate-300">{supplier.industry}</span>
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-white font-medium">{supplier.components_count}</span>
                  </td>
                  <td className="py-4 px-6">
                    <span className={cn(
                      "px-3 py-1 rounded-full text-xs font-medium",
                      getStatusColor(supplier.verification_status)
                    )}>
                      {supplier.verification_status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span className={cn(
                      "px-3 py-1 rounded-full text-xs font-medium",
                      getRiskColor(supplier.risk_level)
                    )}>
                      {supplier.risk_level}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-2">
                      <div className="w-16 h-2 bg-slate-700 rounded-full overflow-hidden">
                        <div 
                          className={cn(
                            "h-full rounded-full",
                            supplier.trust_score >= 80 ? 'bg-green-500' :
                            supplier.trust_score >= 60 ? 'bg-orange-500' : 'bg-red-500'
                          )}
                          style={{ width: `${supplier.trust_score}%` }}
                        />
                      </div>
                      <span className="text-sm text-white font-medium">{supplier.trust_score}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-2">
                      <button className="p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-all" title="View">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 transition-all" title="Edit">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-green-400 hover:bg-green-500/10 transition-all" title="Verify">
                        <FileCheck className="w-4 h-4" />
                      </button>
                      <button className="p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-orange-400 hover:bg-orange-500/10 transition-all" title="Risk Analysis">
                        <Activity className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-800">
          <p className="text-sm text-slate-400">
            Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredSuppliers.length)} of {filteredSuppliers.length} suppliers
          </p>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="text-white px-4">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Search,
  Plus,
  Cpu,
  Building2,
  Globe,
  Shield,
  AlertTriangle,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Eye,
  Edit,
  Activity,
  FileCheck,
  Filter
} from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { cn, getRiskColor, getStatusColor } from '@/lib/utils';
import { demoComponents } from '@/lib/demo-data';

const categories = [
  'All Categories',
  'Semiconductor',
  'Microcontroller',
  'Sensor',
  'PCB',
  'Power IC',
  'Memory',
  'Communication Module',
  'Other'
];

export default function ComponentsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All Categories');
  const [indigenousFilter, setIndigenousFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);

  const filteredComponents = demoComponents.filter(component => {
    const matchesSearch = component.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         component.manufacturer?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'All Categories' || component.category === categoryFilter;
    const matchesIndigenous = indigenousFilter === 'all' || component.indigenous_status === indigenousFilter;
    return matchesSearch && matchesCategory && matchesIndigenous;
  });

  const itemsPerPage = 5;
  const totalPages = Math.ceil(filteredComponents.length / itemsPerPage);
  const paginatedComponents = filteredComponents.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white">Components</h2>
          <p className="text-slate-400">Manage and track technology components</p>
        </div>
        <button className="btn-primary px-6 py-3 rounded-xl text-white font-medium flex items-center justify-center space-x-2">
          <Plus className="w-5 h-5" />
          <span>Add Component</span>
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
              placeholder="Search components by name or manufacturer..."
              className="input-field w-full pl-12 pr-4 py-3 rounded-xl text-white placeholder-slate-500 focus:outline-none"
            />
          </div>
          <div className="flex gap-4">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="input-field px-4 py-3 rounded-xl text-white focus:outline-none min-w-[160px]"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            <select
              value={indigenousFilter}
              onChange={(e) => setIndigenousFilter(e.target.value)}
              className="input-field px-4 py-3 rounded-xl text-white focus:outline-none min-w-[140px]"
            >
              <option value="all">All Origins</option>
              <option value="indigenous">Indigenous</option>
              <option value="imported">Imported</option>
              <option value="unknown">Unknown</option>
            </select>
          </div>
        </div>
      </div>

      {/* Components Table */}
      <div className="glass-card rounded-2xl border border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-900/80">
                <th className="text-left py-4 px-6 text-xs font-semibold text-slate-400 uppercase tracking-wider">Component</th>
                <th className="text-left py-4 px-6 text-xs font-semibold text-slate-400 uppercase tracking-wider">Category</th>
                <th className="text-left py-4 px-6 text-xs font-semibold text-slate-400 uppercase tracking-wider">Manufacturer</th>
                <th className="text-left py-4 px-6 text-xs font-semibold text-slate-400 uppercase tracking-wider">Origin</th>
                <th className="text-left py-4 px-6 text-xs font-semibold text-slate-400 uppercase tracking-wider">Status</th>
                <th className="text-left py-4 px-6 text-xs font-semibold text-slate-400 uppercase tracking-wider">Risk</th>
                <th className="text-left py-4 px-6 text-xs font-semibold text-slate-400 uppercase tracking-wider">Trust Score</th>
                <th className="text-left py-4 px-6 text-xs font-semibold text-slate-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {paginatedComponents.map((component, index) => (
                <motion.tr
                  key={component.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="hover:bg-slate-800/50 transition-colors"
                >
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 flex items-center justify-center">
                        <Cpu className="w-5 h-5 text-purple-400" />
                      </div>
                      <div>
                        <p className="text-white font-medium">{component.name}</p>
                        <p className="text-sm text-slate-500">{component.component_number}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-slate-300">{component.category}</span>
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-slate-300">{component.manufacturer}</span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-2">
                      <Globe className="w-4 h-4 text-slate-500" />
                      <span className={cn(
                        "text-sm",
                        component.indigenous_status === 'indigenous' ? 'text-green-400' :
                        component.indigenous_status === 'imported' ? 'text-blue-400' : 'text-slate-400'
                      )}>
                        {component.country_of_origin}
                      </span>
                    </div>
                    <span className={cn(
                      "text-xs px-2 py-0.5 rounded-full mt-1 inline-block",
                      component.indigenous_status === 'indigenous' ? 'bg-green-500/10 text-green-400' :
                      component.indigenous_status === 'imported' ? 'bg-blue-500/10 text-blue-400' :
                      'bg-slate-500/10 text-slate-400'
                    )}>
                      {component.indigenous_status}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span className={cn(
                      "px-3 py-1 rounded-full text-xs font-medium",
                      getStatusColor(component.verification_status)
                    )}>
                      {component.verification_status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span className={cn(
                      "px-3 py-1 rounded-full text-xs font-medium",
                      getRiskColor(component.risk_level)
                    )}>
                      {component.risk_level}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-2">
                      <div className="w-16 h-2 bg-slate-700 rounded-full overflow-hidden">
                        <div 
                          className={cn(
                            "h-full rounded-full",
                            (component.trust_score || 0) >= 80 ? 'bg-green-500' :
                            (component.trust_score || 0) >= 60 ? 'bg-orange-500' : 'bg-red-500'
                          )}
                          style={{ width: `${component.trust_score || 0}%` }}
                        />
                      </div>
                      <span className="text-sm text-white font-medium">{component.trust_score || 'N/A'}</span>
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
            Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredComponents.length)} of {filteredComponents.length} components
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

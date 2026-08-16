'use client';

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  FileText,
  Upload,
  Search,
  File,
  FileImage,
  CheckCircle,
  Clock,
  X,
  Download,
  Eye,
  Trash2,
  Building2,
  Cpu
} from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { cn, getStatusColor, formatDate } from '@/lib/utils';
import { demoDocuments, demoSuppliers, demoComponents } from '@/lib/demo-data';

const documentTypes = [
  'Company Registration',
  'Product Certificate',
  'Manufacturing Certificate',
  'Quality Certificate',
  'Compliance Document',
  'Origin Proof',
  'Other'
];

export default function DocumentsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filteredDocuments = demoDocuments.filter(doc => {
    const matchesSearch = doc.file_name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === 'all' || doc.document_type === typeFilter;
    return matchesSearch && matchesType;
  });

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadProgress(0);

    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsUploading(false);
            setUploadProgress(0);
          }, 500);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const getFileIcon = (mimeType?: string) => {
    if (mimeType?.includes('pdf')) return <FileText className="w-8 h-8 text-red-400" />;
    if (mimeType?.includes('image')) return <FileImage className="w-8 h-8 text-blue-400" />;
    return <File className="w-8 h-8 text-slate-400" />;
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return 'Unknown';
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`;
  };

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white">Documents</h2>
          <p className="text-slate-400">Manage verification documents and certificates</p>
        </div>
        <button 
          onClick={handleFileSelect}
          className="btn-primary px-6 py-3 rounded-xl text-white font-medium flex items-center justify-center space-x-2"
        >
          <Upload className="w-5 h-5" />
          <span>Upload Document</span>
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.png,.jpg,.jpeg"
          onChange={handleFileUpload}
          className="hidden"
        />
      </div>

      {/* Upload Progress */}
      {isUploading && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-2xl p-4 mb-6 border border-blue-500/30 bg-blue-500/10"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-white font-medium">Uploading document...</span>
            <span className="text-blue-400">{uploadProgress}%</span>
          </div>
          <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-blue-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${uploadProgress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </motion.div>
      )}

      {/* Filters */}
      <div className="glass-card rounded-2xl p-4 mb-6 border border-slate-800">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search documents..."
              className="input-field w-full pl-12 pr-4 py-3 rounded-xl text-white placeholder-slate-500 focus:outline-none"
            />
          </div>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="input-field px-4 py-3 rounded-xl text-white focus:outline-none min-w-[180px]"
          >
            <option value="all">All Document Types</option>
            {documentTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDocuments.map((doc, index) => (
          <motion.div
            key={doc.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="glass-card rounded-2xl p-6 border border-slate-800 card-hover"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-14 h-14 rounded-xl bg-slate-800 flex items-center justify-center">
                {getFileIcon(doc.mime_type)}
              </div>
              <span className={cn(
                "px-3 py-1 rounded-full text-xs font-medium",
                doc.verification_status === 'verified' ? 'bg-green-500/10 text-green-400' :
                doc.verification_status === 'pending' ? 'bg-yellow-500/10 text-yellow-400' :
                'bg-slate-500/10 text-slate-400'
              )}>
                {doc.verification_status}
              </span>
            </div>

            <h3 className="text-white font-medium mb-1 truncate" title={doc.file_name}>
              {doc.file_name}
            </h3>
            <p className="text-sm text-slate-400 mb-4">{doc.document_type}</p>

            <div className="space-y-2 mb-4">
              {doc.supplier_id && (
                <div className="flex items-center space-x-2 text-sm text-slate-400">
                  <Building2 className="w-4 h-4" />
                  <span>
                    {demoSuppliers.find(s => s.id === doc.supplier_id)?.name || 'Unknown Supplier'}
                  </span>
                </div>
              )}
              {doc.component_id && (
                <div className="flex items-center space-x-2 text-sm text-slate-400">
                  <Cpu className="w-4 h-4" />
                  <span>
                    {demoComponents.find(c => c.id === doc.component_id)?.name || 'Unknown Component'}
                  </span>
                </div>
              )}
              <div className="flex items-center space-x-2 text-sm text-slate-500">
                <span>{formatFileSize(doc.file_size)}</span>
                <span>•</span>
                <span>{formatDate(doc.uploaded_at)}</span>
              </div>
            </div>

            <div className="flex items-center space-x-2 pt-4 border-t border-slate-800">
              <button className="flex-1 py-2 rounded-lg bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-all flex items-center justify-center space-x-2">
                <Eye className="w-4 h-4" />
                <span className="text-sm">View</span>
              </button>
              <button className="flex-1 py-2 rounded-lg bg-slate-800 text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 transition-all flex items-center justify-center space-x-2">
                <Download className="w-4 h-4" />
                <span className="text-sm">Download</span>
              </button>
              <button className="p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Empty State */}
      {filteredDocuments.length === 0 && (
        <div className="glass-card rounded-2xl p-12 border border-slate-800 text-center">
          <div className="w-20 h-20 rounded-full bg-slate-800 flex items-center justify-center mx-auto mb-6">
            <FileText className="w-10 h-10 text-slate-500" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">No documents found</h3>
          <p className="text-slate-400">Upload documents to get started with verification.</p>
        </div>
      )}

      {/* Upload Guidelines */}
      <div className="glass-card rounded-2xl p-6 border border-slate-800 mt-6">
        <h3 className="text-lg font-semibold text-white mb-4">Document Upload Guidelines</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h4 className="text-sm font-medium text-slate-300 mb-2">Accepted Formats</h4>
            <p className="text-sm text-slate-400">PDF, PNG, JPG, JPEG files up to 16MB</p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-slate-300 mb-2">Verification Process</h4>
            <p className="text-sm text-slate-400">Documents are reviewed within 2-3 business days</p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-slate-300 mb-2">Security</h4>
            <p className="text-sm text-slate-400">All documents are encrypted and securely stored</p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

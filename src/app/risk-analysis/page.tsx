'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Activity,
  Building2,
  Cpu,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Play,
  Loader2,
  TrendingUp,
  TrendingDown,
  Minus,
  ArrowRight,
  RefreshCw
} from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { cn, getRiskColor } from '@/lib/utils';
import { demoSuppliers, demoComponents, demoRiskAssessments } from '@/lib/demo-data';

export default function RiskAnalysisPage() {
  const [selectedType, setSelectedType] = useState<'supplier' | 'component'>('supplier');
  const [selectedEntity, setSelectedEntity] = useState<number | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<typeof demoRiskAssessments[0] | null>(null);

  const entities = selectedType === 'supplier' ? demoSuppliers : demoComponents;

  const handleAnalyze = async () => {
    if (!selectedEntity) return;
    
    setIsAnalyzing(true);
    // Simulate API call
    setTimeout(() => {
      const mockResult = demoRiskAssessments[Math.floor(Math.random() * demoRiskAssessments.length)];
      setAnalysisResult(mockResult);
      setIsAnalyzing(false);
    }, 2000);
  };

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white">AI Risk Analysis</h2>
        <p className="text-slate-400">Assess supplier and component risks using AI-powered analysis</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Analysis Input */}
        <div className="space-y-6">
          <div className="glass-card rounded-2xl p-6 border border-slate-800">
            <h3 className="text-lg font-semibold text-white mb-6">New Analysis</h3>
            
            {/* Type Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-400 mb-3">Analysis Type</label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => {
                    setSelectedType('supplier');
                    setSelectedEntity(null);
                    setAnalysisResult(null);
                  }}
                  className={cn(
                    "flex items-center justify-center space-x-2 p-4 rounded-xl border transition-all",
                    selectedType === 'supplier'
                      ? 'border-blue-500 bg-blue-500/10 text-blue-400'
                      : 'border-slate-700 bg-slate-800/50 text-slate-400 hover:border-slate-600'
                  )}
                >
                  <Building2 className="w-5 h-5" />
                  <span className="font-medium">Supplier</span>
                </button>
                <button
                  onClick={() => {
                    setSelectedType('component');
                    setSelectedEntity(null);
                    setAnalysisResult(null);
                  }}
                  className={cn(
                    "flex items-center justify-center space-x-2 p-4 rounded-xl border transition-all",
                    selectedType === 'component'
                      ? 'border-purple-500 bg-purple-500/10 text-purple-400'
                      : 'border-slate-700 bg-slate-800/50 text-slate-400 hover:border-slate-600'
                  )}
                >
                  <Cpu className="w-5 h-5" />
                  <span className="font-medium">Component</span>
                </button>
              </div>
            </div>

            {/* Entity Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-400 mb-3">
                Select {selectedType === 'supplier' ? 'Supplier' : 'Component'}
              </label>
              <select
                value={selectedEntity || ''}
                onChange={(e) => setSelectedEntity(Number(e.target.value))}
                className="input-field w-full px-4 py-3 rounded-xl text-white focus:outline-none"
              >
                <option value="">Choose {selectedType}...</option>
                {entities.map(entity => (
                  <option key={entity.id} value={entity.id}>
                    {(entity as any).name}
                  </option>
                ))}
              </select>
            </div>

            {/* Analyze Button */}
            <button
              onClick={handleAnalyze}
              disabled={!selectedEntity || isAnalyzing}
              className="w-full btn-primary py-4 rounded-xl text-white font-semibold flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Analyzing...</span>
                </>
              ) : (
                <>
                  <Play className="w-5 h-5" />
                  <span>Run AI Risk Analysis</span>
                </>
              )}
            </button>

            <div className="mt-4 p-4 rounded-xl bg-amber-500/10 border border-amber-500/30">
              <p className="text-sm text-amber-400">
                <span className="font-semibold">Note:</span> This is an AI-assisted assessment based on available data. 
                Results should be reviewed by qualified personnel before making critical decisions.
              </p>
            </div>
          </div>

          {/* Recent Analyses */}
          <div className="glass-card rounded-2xl p-6 border border-slate-800">
            <h3 className="text-lg font-semibold text-white mb-4">Recent Analyses</h3>
            <div className="space-y-3">
              {demoRiskAssessments.map((assessment) => (
                <div key={assessment.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-800/50">
                  <div>
                    <p className="text-white font-medium">
                      {assessment.supplier_id 
                        ? demoSuppliers.find(s => s.id === assessment.supplier_id)?.name 
                        : demoComponents.find(c => c.id === assessment.component_id)?.name}
                    </p>
                    <p className="text-sm text-slate-500">
                      {new Date(assessment.created_at).toLocaleDateString('en-IN')}
                    </p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className={cn(
                      "px-3 py-1 rounded-full text-xs font-medium",
                      getRiskColor(assessment.risk_level)
                    )}>
                      {assessment.risk_level}
                    </span>
                    <span className="text-white font-bold">{assessment.risk_score}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Analysis Results */}
        <div>
          {analysisResult ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card rounded-2xl p-6 border border-slate-800"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-white">Analysis Results</h3>
                <button 
                  onClick={() => setAnalysisResult(null)}
                  className="p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>

              {/* Risk Score */}
              <div className="text-center mb-8">
                <div className="relative inline-flex items-center justify-center">
                  <svg className="w-48 h-48 transform -rotate-90">
                    <circle cx="96" cy="96" r="84" stroke="currentColor" strokeWidth="16" fill="none" className="text-slate-800" />
                    <circle cx="96" cy="96" r="84" stroke="currentColor" strokeWidth="16" fill="none" 
                      className={cn(
                        analysisResult.risk_score >= 80 ? 'text-green-500' :
                        analysisResult.risk_score >= 60 ? 'text-orange-500' : 'text-red-500'
                      )}
                      strokeDasharray={`${analysisResult.risk_score * 5.27} 527`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-5xl font-bold text-white">{analysisResult.risk_score}</span>
                    <span className="text-sm text-slate-400">/ 100</span>
                  </div>
                </div>
                <div className="mt-4">
                  <span className={cn(
                    "px-6 py-2 rounded-full text-lg font-bold",
                    getRiskColor(analysisResult.risk_level)
                  )}>
                    {analysisResult.risk_level} RISK
                  </span>
                </div>
                <p className="text-sm text-slate-400 mt-2">
                  Confidence: {(analysisResult.confidence * 100).toFixed(0)}%
                </p>
              </div>

              {/* Factors */}
              <div className="space-y-4 mb-6">
                <h4 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Risk Factors</h4>
                {Object.entries(analysisResult.factors).map(([factor, score]) => (
                  <div key={factor}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-slate-300 capitalize">{factor.replace('_', ' ')}</span>
                      <span className="text-white font-medium">{score}%</span>
                    </div>
                    <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                      <div 
                        className={cn(
                          "h-full rounded-full transition-all",
                          score >= 80 ? 'bg-green-500' : score >= 60 ? 'bg-orange-500' : 'bg-red-500'
                        )}
                        style={{ width: `${score}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Assessment Summary */}
              <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/30 mb-6">
                <h4 className="text-sm font-semibold text-blue-400 mb-2">AI Assessment</h4>
                <p className="text-sm text-slate-300">{analysisResult.assessment_summary}</p>
              </div>

              {/* Positive & Negative Factors */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/30">
                  <h4 className="text-sm font-semibold text-green-400 mb-3 flex items-center">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Positive Factors
                  </h4>
                  <ul className="space-y-2">
                    {analysisResult.positive_factors.map((factor, idx) => (
                      <li key={idx} className="text-sm text-slate-300 flex items-start">
                        <span className="text-green-400 mr-2">+</span>
                        {factor}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30">
                  <h4 className="text-sm font-semibold text-red-400 mb-3 flex items-center">
                    <XCircle className="w-4 h-4 mr-2" />
                    Risk Factors
                  </h4>
                  <ul className="space-y-2">
                    {analysisResult.negative_factors.map((factor, idx) => (
                      <li key={idx} className="text-sm text-slate-300 flex items-start">
                        <span className="text-red-400 mr-2">-</span>
                        {factor}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="glass-card rounded-2xl p-8 border border-slate-800 h-full flex flex-col items-center justify-center text-center">
              <div className="w-24 h-24 rounded-full bg-slate-800 flex items-center justify-center mb-6">
                <Activity className="w-12 h-12 text-slate-500" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">No Analysis Selected</h3>
              <p className="text-slate-400 max-w-sm">
                Select a supplier or component and run the AI risk analysis to see detailed results here.
              </p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

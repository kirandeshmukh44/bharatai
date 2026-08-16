'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Shield, 
  Cpu, 
  Globe, 
  FileCheck, 
  TrendingUp, 
  AlertTriangle,
  Database,
  Lock,
  Search,
  CheckCircle,
  Menu,
  X,
  ArrowRight,
  Activity,
  Layers,
  Zap
} from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

// Navigation Component
function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
      isScrolled ? "glass py-3" : "bg-transparent py-5"
    )}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-orange-500 flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-xl font-bold text-white">BharatAI</span>
              <span className="hidden sm:inline text-xs text-slate-400 ml-2">Secure Supply Chain</span>
            </div>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            <Link href="#features" className="text-sm text-slate-300 hover:text-white transition-colors">Features</Link>
            <Link href="#solution" className="text-sm text-slate-300 hover:text-white transition-colors">Solution</Link>
            <Link href="#ai-engine" className="text-sm text-slate-300 hover:text-white transition-colors">AI Engine</Link>
            <Link href="#security" className="text-sm text-slate-300 hover:text-white transition-colors">Security</Link>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <Link href="/login" className="text-sm text-slate-300 hover:text-white transition-colors">Sign In</Link>
            <Link href="/register" className="btn-primary px-5 py-2 rounded-lg text-sm font-medium text-white">
              Get Started
            </Link>
          </div>

          <button 
            className="md:hidden text-white"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden mt-4 pb-4 space-y-4"
          >
            <Link href="#features" className="block text-slate-300 hover:text-white">Features</Link>
            <Link href="#solution" className="block text-slate-300 hover:text-white">Solution</Link>
            <Link href="#ai-engine" className="block text-slate-300 hover:text-white">AI Engine</Link>
            <Link href="/login" className="block text-slate-300 hover:text-white">Sign In</Link>
            <Link href="/register" className="block btn-primary px-5 py-2 rounded-lg text-center text-white">Get Started</Link>
          </motion.div>
        )}
      </div>
    </nav>
  );
}

// Hero Section
function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden gradient-bg">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-orange-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-3xl" />
      </div>

      {/* Grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:64px_64px]" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/30 mb-8">
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
            <span className="text-sm text-blue-300">AI-Powered Supply Chain Intelligence</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
            Secure India's Technology
            <br />
            <span className="text-gradient">Supply Chain with AI</span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-400 max-w-3xl mx-auto mb-10">
            Verify indigenous components, assess supplier risks, and build a more resilient 
            technology ecosystem for India's technology sovereignty.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/register" className="btn-primary px-8 py-4 rounded-xl text-base font-semibold text-white flex items-center space-x-2">
              <span>Get Started</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link href="/dashboard" className="btn-secondary px-8 py-4 rounded-xl text-base font-semibold text-white flex items-center space-x-2">
              <span>Explore Platform</span>
            </Link>
          </div>
        </motion.div>

        {/* Supply Chain Flow Animation */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-16 relative"
        >
          <div className="glass-card rounded-2xl p-8 max-w-4xl mx-auto">
            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8">
              {[
                { icon: Database, label: 'Supplier', color: 'blue' },
                { icon: Cpu, label: 'Component', color: 'purple' },
                { icon: FileCheck, label: 'Verification', color: 'green' },
                { icon: Activity, label: 'AI Analysis', color: 'orange' },
                { icon: Shield, label: 'Trusted Chain', color: 'cyan' },
              ].map((item, index) => (
                <div key={index} className="flex items-center">
                  <div className={cn(
                    "network-node w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex flex-col items-center justify-center",
                    item.color === 'blue' && "bg-blue-500/20 border border-blue-500/40",
                    item.color === 'purple' && "bg-purple-500/20 border border-purple-500/40",
                    item.color === 'green' && "bg-green-500/20 border border-green-500/40",
                    item.color === 'orange' && "bg-orange-500/20 border border-orange-500/40",
                    item.color === 'cyan' && "bg-cyan-500/20 border border-cyan-500/40",
                  )}>
                    <item.icon className={cn(
                      "w-6 h-6 sm:w-8 sm:h-8 mb-1",
                      item.color === 'blue' && "text-blue-400",
                      item.color === 'purple' && "text-purple-400",
                      item.color === 'green' && "text-green-400",
                      item.color === 'orange' && "text-orange-400",
                      item.color === 'cyan' && "text-cyan-400",
                    )} />
                    <span className="text-xs text-slate-300">{item.label}</span>
                  </div>
                  {index < 4 && (
                    <div className="hidden sm:flex items-center mx-2">
                      <div className="w-8 h-px bg-gradient-to-r from-slate-600 to-slate-400" />
                      <ArrowRight className="w-4 h-4 text-slate-400 -ml-1" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// Problem Section
function ProblemSection() {
  const problems = [
    {
      icon: AlertTriangle,
      title: 'Unverified Component Origin',
      description: 'Difficulty in tracing the true origin of technology components, leading to potential security vulnerabilities.'
    },
    {
      icon: Search,
      title: 'Supplier Risk Assessment',
      description: 'Limited visibility into supplier reliability, compliance history, and operational stability across the supply chain.'
    },
    {
      icon: Globe,
      title: 'Supply Chain Dependency',
      description: 'Over-reliance on foreign suppliers without adequate domestic alternatives or verification mechanisms.'
    },
    {
      icon: Layers,
      title: 'Limited Visibility',
      description: 'Fragmented information across multiple systems makes comprehensive supply chain analysis nearly impossible.'
    }
  ];

  return (
    <section id="features" className="py-24 bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Why Supply Chain Trust Matters</h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Organizations face critical challenges in verifying component origins and assessing supplier risks in complex global supply chains.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {problems.map((problem, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="glass-card rounded-2xl p-6 card-hover"
            >
              <div className="w-12 h-12 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center justify-center mb-4">
                <problem.icon className="w-6 h-6 text-red-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">{problem.title}</h3>
              <p className="text-slate-400 text-sm">{problem.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Solution Section
function SolutionSection() {
  const steps = [
    { number: '01', title: 'Supplier Registration', description: 'Register suppliers with comprehensive profile and documentation' },
    { number: '02', title: 'Component Identification', description: 'Catalog components with detailed specifications and origin data' },
    { number: '03', title: 'Document Submission', description: 'Upload certificates, compliance documents, and origin proofs' },
    { number: '04', title: 'Data Validation', description: 'Verify submitted information against trusted sources' },
    { number: '05', title: 'AI Risk Analysis', description: 'Machine learning models assess risk factors and generate scores' },
    { number: '06', title: 'Verification Result', description: 'Receive comprehensive verification reports with trust scores' },
  ];

  return (
    <section id="solution" className="py-24 bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">One Platform. Complete Supply Chain Intelligence.</h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            End-to-end solution for managing, verifying, and analyzing your technology supply chain.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="relative"
            >
              <div className="glass-card rounded-2xl p-6 h-full card-hover">
                <span className="text-5xl font-bold text-slate-800 absolute top-4 right-4">{step.number}</span>
                <div className="relative z-10">
                  <h3 className="text-lg font-semibold text-white mb-2">{step.title}</h3>
                  <p className="text-slate-400 text-sm">{step.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// AI Engine Section
function AIEngineSection() {
  const factors = [
    { name: 'Documentation', score: 85, color: 'bg-green-500' },
    { name: 'Compliance', score: 90, color: 'bg-green-500' },
    { name: 'Supplier Reliability', score: 70, color: 'bg-orange-500' },
    { name: 'Origin Confidence', score: 65, color: 'bg-orange-500' },
  ];

  return (
    <section id="ai-engine" className="py-24 bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">AI-Powered Risk Assessment</h2>
            <p className="text-slate-400 mb-8">
              Our advanced machine learning models analyze multiple risk factors to provide accurate trust scores and actionable insights.
            </p>

            <div className="space-y-4">
              {factors.map((factor, index) => (
                <div key={index}>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-slate-300">{factor.name}</span>
                    <span className="text-white font-medium">{factor.score}%</span>
                  </div>
                  <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div 
                      className={cn("h-full rounded-full transition-all duration-1000", factor.color)}
                      style={{ width: `${factor.score}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 p-4 rounded-xl bg-blue-500/10 border border-blue-500/30">
              <p className="text-sm text-blue-300">
                <span className="font-semibold">AI Assessment:</span> Supplier demonstrates acceptable operational reliability, but documentation completeness and origin verification require additional review.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex justify-center"
          >
            <div className="glass-card rounded-3xl p-8 w-full max-w-md">
              <div className="text-center mb-6">
                <span className="text-sm text-slate-400 uppercase tracking-wider">AI Risk Score</span>
                <div className="mt-4 relative inline-flex items-center justify-center">
                  <svg className="w-40 h-40 transform -rotate-90">
                    <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="12" fill="none" className="text-slate-800" />
                    <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="12" fill="none" 
                      className="text-orange-500" 
                      strokeDasharray={`${72 * 4.4} 440`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-4xl font-bold text-white">72</span>
                    <span className="text-sm text-slate-400">/ 100</span>
                  </div>
                </div>
              </div>

              <div className="text-center">
                <span className="inline-block px-4 py-2 rounded-full bg-orange-500/20 text-orange-400 font-semibold">
                  MEDIUM RISK
                </span>
              </div>

              <div className="mt-6 pt-6 border-t border-slate-800">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Confidence</span>
                  <span className="text-white font-medium">84%</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// Indigenous Section
function IndigenousSection() {
  return (
    <section className="py-24 bg-gradient-to-br from-orange-950/30 via-slate-900 to-blue-950/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-orange-500/10 border border-orange-500/30 mb-6">
            <Zap className="w-4 h-4 text-orange-400" />
            <span className="text-sm text-orange-300">Indigenous Technology</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Support Indigenous Innovation</h2>
          <p className="text-slate-400 max-w-3xl mx-auto mb-8">
            Identify and evaluate Indian suppliers and components to build a self-reliant technology ecosystem. 
            Our platform helps organizations discover domestic alternatives and verify indigenous manufacturing claims.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            {[
              { value: '217', label: 'Indigenous Components', color: 'text-green-400' },
              { value: '94', label: 'Verified Indian Suppliers', color: 'text-blue-400' },
              { value: '61%', label: 'Domestic Sourcing', color: 'text-orange-400' },
            ].map((stat, index) => (
              <div key={index} className="glass-card rounded-2xl p-6">
                <span className={cn("text-4xl font-bold", stat.color)}>{stat.value}</span>
                <p className="text-slate-400 mt-2">{stat.label}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// Dashboard Preview Section
function DashboardPreviewSection() {
  return (
    <section className="py-24 bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Powerful Dashboard</h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Get comprehensive insights into your supply chain with real-time analytics and risk monitoring.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass-card rounded-2xl overflow-hidden border border-slate-800"
        >
          <div className="bg-slate-900/80 px-4 py-3 flex items-center space-x-2 border-b border-slate-800">
            <div className="flex space-x-2">
              <div className="w-3 h-3 rounded-full bg-red-500/80" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
              <div className="w-3 h-3 rounded-full bg-green-500/80" />
            </div>
            <div className="flex-1 text-center">
              <span className="text-xs text-slate-500">BharatAI Dashboard</span>
            </div>
          </div>
          <div className="p-6 bg-slate-950/50">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              {[
                { label: 'Total Suppliers', value: '128', color: 'blue' },
                { label: 'Components', value: '356', color: 'purple' },
                { label: 'Indigenous', value: '217', color: 'green' },
                { label: 'High Risk', value: '18', color: 'red' },
              ].map((kpi, index) => (
                <div key={index} className="bg-slate-900/80 rounded-xl p-4 border border-slate-800">
                  <p className="text-xs text-slate-500 mb-1">{kpi.label}</p>
                  <p className={cn("text-2xl font-bold", 
                    kpi.color === 'blue' && "text-blue-400",
                    kpi.color === 'purple' && "text-purple-400",
                    kpi.color === 'green' && "text-green-400",
                    kpi.color === 'red' && "text-red-400",
                  )}>{kpi.value}</p>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-900/80 rounded-xl p-4 border border-slate-800 h-48 flex items-center justify-center">
                <div className="text-center">
                  <Activity className="w-12 h-12 text-blue-400 mx-auto mb-2" />
                  <p className="text-slate-400 text-sm">Risk Distribution Chart</p>
                </div>
              </div>
              <div className="bg-slate-900/80 rounded-xl p-4 border border-slate-800 h-48 flex items-center justify-center">
                <div className="text-center">
                  <TrendingUp className="w-12 h-12 text-green-400 mx-auto mb-2" />
                  <p className="text-slate-400 text-sm">Supplier Trends</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// Security Section
function SecuritySection() {
  const features = [
    { icon: Lock, title: 'Role-based Access', description: 'Granular permissions for different user roles' },
    { icon: CheckCircle, title: 'Secure Authentication', description: 'JWT-based authentication with password hashing' },
    { icon: FileCheck, title: 'Data Validation', description: 'Comprehensive input validation and sanitization' },
    { icon: Database, title: 'Audit Logging', description: 'Complete audit trail of all system activities' },
    { icon: Shield, title: 'Document Security', description: 'Secure file upload with type validation' },
    { icon: AlertTriangle, title: 'Risk Monitoring', description: 'Continuous monitoring of supply chain risks' },
  ];

  return (
    <section id="security" className="py-24 bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Enterprise-Grade Security</h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Built with security at its core to protect sensitive supply chain information.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="glass-card rounded-2xl p-6 card-hover"
            >
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center mb-4">
                <feature.icon className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
              <p className="text-slate-400 text-sm">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// CTA Section
function CTASection() {
  return (
    <section className="py-24 bg-gradient-to-br from-blue-950/50 via-slate-950 to-orange-950/30">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Build a More Resilient Technology Supply Chain
          </h2>
          <p className="text-slate-400 mb-8 max-w-2xl mx-auto">
            Join organizations using BharatAI to verify indigenous components, assess risks, and build trustworthy supply chains.
          </p>
          <Link href="/dashboard" className="btn-primary inline-flex items-center space-x-2 px-8 py-4 rounded-xl text-base font-semibold text-white">
            <span>Start Verification</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

// Footer
function Footer() {
  return (
    <footer className="bg-slate-950 border-t border-slate-900 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-orange-500 flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">BharatAI</span>
            </div>
            <p className="text-slate-400 text-sm max-w-sm">
              AI-Powered Indigenous Component Verification & Supply Chain Intelligence Platform for India's technology sovereignty.
            </p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Platform</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><Link href="/dashboard" className="hover:text-white transition-colors">Dashboard</Link></li>
              <li><Link href="/suppliers" className="hover:text-white transition-colors">Suppliers</Link></li>
              <li><Link href="/components" className="hover:text-white transition-colors">Components</Link></li>
              <li><Link href="/risk-analysis" className="hover:text-white transition-colors">Risk Analysis</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Account</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><Link href="/login" className="hover:text-white transition-colors">Sign In</Link></li>
              <li><Link href="/register" className="hover:text-white transition-colors">Register</Link></li>
              <li><Link href="/profile" className="hover:text-white transition-colors">Profile</Link></li>
            </ul>
          </div>
        </div>
        <div className="pt-8 border-t border-slate-900 flex flex-col md:flex-row items-center justify-between">
          <p className="text-slate-500 text-sm">
            © 2024 BharatAI. Demo/Prototype Environment.
          </p>
          <div className="flex items-center space-x-2 mt-4 md:mt-0">
            <span className="demo-badge">DEMO ENVIRONMENT</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

// Main Page Component
export default function LandingPage() {
  return (
    <main className="min-h-screen bg-slate-950">
      <Navbar />
      <HeroSection />
      <ProblemSection />
      <SolutionSection />
      <AIEngineSection />
      <IndigenousSection />
      <DashboardPreviewSection />
      <SecuritySection />
      <CTASection />
      <Footer />
    </main>
  );
}

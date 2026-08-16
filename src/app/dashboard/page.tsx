'use client';

import { motion } from 'framer-motion';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  LineChart,
  Line,
  Area,
  AreaChart
} from 'recharts';
import {
  Building2,
  Cpu,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  Globe
} from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { cn, formatNumber } from '@/lib/utils';
import { dashboardStats, trendData } from '@/lib/demo-data';

// KPI Card Component
interface KPICardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ElementType;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  color: 'blue' | 'green' | 'orange' | 'red' | 'purple';
}

function KPICard({ title, value, subtitle, icon: Icon, trend, trendValue, color }: KPICardProps) {
  const colorClasses = {
    blue: 'from-blue-500/20 to-blue-600/10 border-blue-500/30 text-blue-400',
    green: 'from-green-500/20 to-green-600/10 border-green-500/30 text-green-400',
    orange: 'from-orange-500/20 to-orange-600/10 border-orange-500/30 text-orange-400',
    red: 'from-red-500/20 to-red-600/10 border-red-500/30 text-red-400',
    purple: 'from-purple-500/20 to-purple-600/10 border-purple-500/30 text-purple-400',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "glass-card rounded-2xl p-6 border bg-gradient-to-br card-hover",
        colorClasses[color]
      )}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-slate-400 font-medium">{title}</p>
          <h3 className="text-3xl font-bold text-white mt-2">{value}</h3>
          {subtitle && <p className="text-sm text-slate-400 mt-1">{subtitle}</p>}
          {trend && trendValue && (
            <div className={cn(
              "flex items-center space-x-1 mt-3 text-sm",
              trend === 'up' ? 'text-green-400' : trend === 'down' ? 'text-red-400' : 'text-slate-400'
            )}>
              {trend === 'up' ? <ArrowUpRight className="w-4 h-4" /> : 
               trend === 'down' ? <ArrowDownRight className="w-4 h-4" /> : null}
              <span>{trendValue}</span>
            </div>
          )}
        </div>
        <div className={cn(
          "w-12 h-12 rounded-xl flex items-center justify-center bg-slate-800/50",
          color === 'blue' && 'text-blue-400',
          color === 'green' && 'text-green-400',
          color === 'orange' && 'text-orange-400',
          color === 'red' && 'text-red-400',
          color === 'purple' && 'text-purple-400',
        )}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </motion.div>
  );
}

// Risk Distribution Chart
function RiskDistributionChart() {
  const data = [
    { name: 'Low Risk', value: dashboardStats.risk_distribution['LOW'], color: '#22c55e' },
    { name: 'Medium Risk', value: dashboardStats.risk_distribution['MEDIUM'], color: '#f97316' },
    { name: 'High Risk', value: dashboardStats.risk_distribution['HIGH'], color: '#ef4444' },
  ];

  return (
    <div className="glass-card rounded-2xl p-6 border border-slate-800">
      <h3 className="text-lg font-semibold text-white mb-6">Risk Distribution</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#1e293b', 
                border: '1px solid #334155',
                borderRadius: '8px',
                color: '#fff'
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="flex justify-center space-x-6 mt-4">
        {data.map((item) => (
          <div key={item.name} className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
            <span className="text-sm text-slate-400">{item.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// Indigenous vs Imported Chart
function IndigenousChart() {
  const data = [
    { name: 'Indigenous', value: dashboardStats.indigenous_distribution['indigenous'], color: '#22c55e' },
    { name: 'Imported', value: dashboardStats.indigenous_distribution['imported'], color: '#3b82f6' },
    { name: 'Unknown', value: dashboardStats.indigenous_distribution['unknown'], color: '#64748b' },
  ];

  return (
    <div className="glass-card rounded-2xl p-6 border border-slate-800">
      <h3 className="text-lg font-semibold text-white mb-6">Indigenous vs Imported</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis type="number" stroke="#64748b" />
            <YAxis dataKey="name" type="category" stroke="#94a3b8" width={80} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#1e293b', 
                border: '1px solid #334155',
                borderRadius: '8px',
                color: '#fff'
              }}
            />
            <Bar dataKey="value" radius={[0, 4, 4, 0]}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

// Trend Chart
function TrendChart() {
  return (
    <div className="glass-card rounded-2xl p-6 border border-slate-800">
      <h3 className="text-lg font-semibold text-white mb-6">Risk Trend (30 Days)</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={trendData}>
            <defs>
              <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis 
              dataKey="date" 
              stroke="#64748b"
              tickFormatter={(value) => new Date(value).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
            />
            <YAxis stroke="#64748b" domain={[0, 100]} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#1e293b', 
                border: '1px solid #334155',
                borderRadius: '8px',
                color: '#fff'
              }}
            />
            <Area 
              type="monotone" 
              dataKey="avg_risk_score" 
              stroke="#3b82f6" 
              fillOpacity={1} 
              fill="url(#colorScore)" 
              name="Avg Risk Score"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

// Category Distribution Chart
function CategoryChart() {
  const data = Object.entries(dashboardStats.category_distribution).map(([name, value]) => ({
    name: name.length > 10 ? name.substring(0, 10) + '...' : name,
    fullName: name,
    value
  }));

  return (
    <div className="glass-card rounded-2xl p-6 border border-slate-800">
      <h3 className="text-lg font-semibold text-white mb-6">Component Categories</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="name" stroke="#64748b" angle={-45} textAnchor="end" height={80} />
            <YAxis stroke="#64748b" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#1e293b', 
                border: '1px solid #334155',
                borderRadius: '8px',
                color: '#fff'
              }}
              labelFormatter={(value, payload) => payload?.[0]?.payload?.fullName || value}
            />
            <Bar dataKey="value" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

// Recent Activity Component
function RecentActivity() {
  const activities = [
    { id: 1, action: 'Risk Analysis', entity: 'Bharat Semiconductor Systems', time: '2 hours ago', type: 'success' },
    { id: 2, action: 'Verification Request', entity: 'Nova Power Electronics', time: '4 hours ago', type: 'pending' },
    { id: 3, action: 'Document Upload', entity: 'India Embedded Technologies', time: '6 hours ago', type: 'info' },
    { id: 4, action: 'Supplier Added', entity: 'Deccan Micro Devices', time: '1 day ago', type: 'success' },
    { id: 5, action: 'Risk Alert', entity: 'Himalaya Circuits Pvt Ltd', time: '1 day ago', type: 'warning' },
  ];

  return (
    <div className="glass-card rounded-2xl p-6 border border-slate-800">
      <h3 className="text-lg font-semibold text-white mb-6">Recent Activity</h3>
      <div className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-start space-x-4 p-3 rounded-xl bg-slate-800/50">
            <div className={cn(
              "w-2 h-2 rounded-full mt-2",
              activity.type === 'success' && 'bg-green-500',
              activity.type === 'pending' && 'bg-yellow-500',
              activity.type === 'info' && 'bg-blue-500',
              activity.type === 'warning' && 'bg-red-500',
            )} />
            <div className="flex-1">
              <p className="text-sm text-white font-medium">{activity.action}</p>
              <p className="text-sm text-slate-400">{activity.entity}</p>
            </div>
            <span className="text-xs text-slate-500">{activity.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// Main Dashboard Page
export default function DashboardPage() {
  const { kpi } = dashboardStats;

  return (
    <DashboardLayout>
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <KPICard
          title="Total Suppliers"
          value={formatNumber(kpi.total_suppliers)}
          subtitle={`${kpi.verified_suppliers} verified`}
          icon={Building2}
          trend="up"
          trendValue="+12% this month"
          color="blue"
        />
        <KPICard
          title="Total Components"
          value={formatNumber(kpi.total_components)}
          subtitle="Across all categories"
          icon={Cpu}
          trend="up"
          trendValue="+8% this month"
          color="purple"
        />
        <KPICard
          title="Indigenous Components"
          value={formatNumber(kpi.indigenous_components)}
          subtitle={`${Math.round((kpi.indigenous_components / kpi.total_components) * 100)}% of total`}
          icon={Globe}
          trend="up"
          trendValue="+15% this quarter"
          color="green"
        />
        <KPICard
          title="High Risk Items"
          value={formatNumber(kpi.high_risk_count)}
          subtitle="Requires attention"
          icon={AlertTriangle}
          trend="down"
          trendValue="-5% this month"
          color="red"
        />
        <KPICard
          title="Verified Suppliers"
          value={formatNumber(kpi.verified_suppliers)}
          subtitle={`${Math.round((kpi.verified_suppliers / kpi.total_suppliers) * 100)}% verification rate`}
          icon={CheckCircle}
          trend="up"
          trendValue="+3% this month"
          color="green"
        />
        <KPICard
          title="Pending Verification"
          value={formatNumber(kpi.pending_verification)}
          subtitle="In review queue"
          icon={Clock}
          trend="neutral"
          trendValue="No change"
          color="orange"
        />
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <RiskDistributionChart />
        <IndigenousChart />
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <TrendChart />
        <CategoryChart />
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RecentActivity />
        </div>
        <div className="glass-card rounded-2xl p-6 border border-slate-800">
          <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button className="w-full flex items-center space-x-3 p-4 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-400 hover:bg-blue-500/20 transition-all text-left">
              <Building2 className="w-5 h-5" />
              <span className="font-medium">Add New Supplier</span>
            </button>
            <button className="w-full flex items-center space-x-3 p-4 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-400 hover:bg-purple-500/20 transition-all text-left">
              <Cpu className="w-5 h-5" />
              <span className="font-medium">Register Component</span>
            </button>
            <button className="w-full flex items-center space-x-3 p-4 rounded-xl bg-green-500/10 border border-green-500/30 text-green-400 hover:bg-green-500/20 transition-all text-left">
              <Activity className="w-5 h-5" />
              <span className="font-medium">Run Risk Analysis</span>
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

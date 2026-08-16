import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date): string {
  const d = new Date(date);
  return d.toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat('en-IN').format(num);
}

export function getRiskColor(level: string): string {
  switch (level?.toLowerCase()) {
    case 'low':
      return 'text-green-500 bg-green-500/10 border-green-500/30';
    case 'medium':
      return 'text-orange-500 bg-orange-500/10 border-orange-500/30';
    case 'high':
      return 'text-red-500 bg-red-500/10 border-red-500/30';
    default:
      return 'text-slate-400 bg-slate-400/10 border-slate-400/30';
  }
}

export function getStatusColor(status: string): string {
  switch (status?.toLowerCase()) {
    case 'verified':
      return 'text-green-500 bg-green-500/10';
    case 'partially_verified':
      return 'text-blue-500 bg-blue-500/10';
    case 'pending':
      return 'text-yellow-500 bg-yellow-500/10';
    case 'unverified':
    default:
      return 'text-slate-400 bg-slate-400/10';
  }
}

export function getTrustScoreColor(score: number): string {
  if (score >= 80) return 'text-green-500';
  if (score >= 60) return 'text-orange-500';
  return 'text-red-500';
}

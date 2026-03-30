import { ReactNode } from 'react';
import { ArrowUp, ArrowDown } from 'lucide-react';
import { motion } from 'framer-motion';

interface KpiCardProps {
  title: string;
  value: string | number;
  change?: number;
  icon: ReactNode;
  suffix?: string;
  color?: string;
}

const KpiCard = ({ title, value, change, icon, suffix, color }: KpiCardProps) => {
  const isPositive = change && change > 0;
  const isNegative = change && change < 0;

  // Gradient colors based on color prop
  const getGradient = (color: string | undefined) => {
    if (!color) return 'from-indigo-500 to-purple-600';
    if (color.includes('warning')) return 'from-amber-500 to-orange-500';
    if (color.includes('success')) return 'from-emerald-500 to-green-600';
    if (color.includes('destructive')) return 'from-rose-500 to-red-600';
    if (color.includes('info')) return 'from-blue-500 to-cyan-500';
    return 'from-indigo-500 to-purple-600';
  };

  return (
    <motion.div
      className="kpi-card relative overflow-hidden"
      whileHover={{ scale: 1.02, boxShadow: '0 20px 40px -10px rgba(0,0,0,0.15)' }}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
    >
      {/* Gradient background */}
      <div className={`absolute inset-0 bg-gradient-to-br ${getGradient(color)} opacity-5`} />
      
      <div className="flex items-start justify-between mb-4 relative z-10">
        <div className={`p-2.5 rounded-xl bg-gradient-to-br ${getGradient(color)} shadow-lg shadow-indigo-500/20`}>
          <div className="text-white">{icon}</div>
        </div>
        {change !== undefined && (
          <div className={`flex items-center gap-0.5 text-2xs font-medium ${isPositive ? 'text-success' : isNegative ? 'text-destructive' : 'text-muted-foreground'}`}>
            {isPositive ? <ArrowUp size={11} /> : isNegative ? <ArrowDown size={11} /> : null}
            {Math.abs(change)}%
          </div>
        )}
      </div>
      <div className="text-xl font-display font-bold text-foreground tracking-tight relative z-10">
        {value}{suffix && <span className="text-xs font-normal text-muted-foreground ml-1">{suffix}</span>}
      </div>
      <p className="text-2xs text-muted-foreground mt-1.5 relative z-10">{title}</p>
    </motion.div>
  );
};

export default KpiCard;

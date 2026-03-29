import { motion } from 'framer-motion';
import { Users, TrendingUp, DollarSign, Clock, CheckCircle, AlertTriangle, Star, IndianRupee } from 'lucide-react';
import { KpiCard } from './KpiCard';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';

interface AnalyticsData {
  totalLeads: number;
  newToday: number;
  avgResponseTime: number;
  visitsScheduled: number;
  visitsCompleted: number;
  bookingsClosed: number;
  conversionRate: number;
  slaCompliance: number;
  slaBreaches: number;
  revenue: number;
  pendingRevenue: number;
  projectedRevenue: number;
  activeBookings: number;
}

interface AnalyticsDashboardProps {
  data?: AnalyticsData;
  isLoading?: boolean;
  showRevenue?: boolean;
}

const PIE_COLORS = [
  'hsl(var(--accent))', 'hsl(var(--info))', 'hsl(var(--destructive))',
  'hsl(262, 55%, 55%)', 'hsl(var(--warning))', 'hsl(var(--success))',
];

const AnalyticsDashboard = ({ data, isLoading = false, showRevenue = true }: AnalyticsDashboardProps) => {
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => <Skeleton key={i} className="h-[130px] rounded-2xl" />)}
        </div>
        {showRevenue && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-[130px] rounded-2xl" />)}
          </div>
        )}
      </div>
    );
  }

  const analyticsData = data || {
    totalLeads: 0,
    newToday: 0,
    avgResponseTime: 0,
    visitsScheduled: 0,
    visitsCompleted: 0,
    bookingsClosed: 0,
    conversionRate: 0,
    slaCompliance: 0,
    slaBreaches: 0,
    revenue: 0,
    pendingRevenue: 0,
    projectedRevenue: 0,
    activeBookings: 0,
  };

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KpiCard title="Total Leads" value={analyticsData.totalLeads} icon={<Users size={17} />} />
        <KpiCard title="Avg Response Time" value={analyticsData.avgResponseTime} suffix="min" icon={<Clock size={17} />} color="hsl(var(--warning))" />
        <KpiCard title="Visits Scheduled" value={analyticsData.visitsScheduled} icon={<CheckCircle size={17} />} color="hsl(173, 55%, 42%)" />
        <KpiCard title="Bookings Closed" value={analyticsData.bookingsClosed} icon={<TrendingUp size={17} />} color="hsl(var(--success))" />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KpiCard title="Conversion Rate" value={analyticsData.conversionRate} suffix="%" icon={<TrendingUp size={17} />} color="hsl(262, 55%, 55%)" />
        <KpiCard title="SLA Compliance" value={analyticsData.slaCompliance} suffix="%" icon={<Clock size={17} />} color="hsl(var(--info))" />
        <KpiCard title="New Today" value={analyticsData.newToday} icon={<Users size={17} />} color="hsl(var(--destructive))" />
        <KpiCard title="SLA Breaches" value={analyticsData.slaBreaches} icon={<AlertTriangle size={17} />} color="hsl(0, 55%, 50%)" />
      </div>

      {/* Revenue Section */}
      {showRevenue && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <KpiCard title="Confirmed Revenue" value={`₹${(analyticsData.revenue / 1000).toFixed(0)}k`} icon={<IndianRupee size={17} />} color="hsl(var(--success))" />
          <KpiCard title="Pipeline Revenue" value={`₹${(analyticsData.pendingRevenue / 1000).toFixed(0)}k`} icon={<TrendingUp size={17} />} color="hsl(var(--warning))" />
          <KpiCard title="Projected Revenue" value={`₹${(analyticsData.projectedRevenue / 1000).toFixed(0)}k`} icon={<IndianRupee size={17} />} color="hsl(var(--accent))" />
          <KpiCard title="Active Bookings" value={analyticsData.activeBookings} icon={<CheckCircle size={17} />} color="hsl(var(--info))" />
        </div>
      )}
    </div>
  );
};

export default AnalyticsDashboard;

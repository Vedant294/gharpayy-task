import { motion } from 'framer-motion';
import { AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { useUsageStats } from '@/hooks/useSubscription';
import { getUsagePercentage } from '@/lib/usageTracker';
import { Skeleton } from './ui/skeleton';

interface UsageMonitorProps {
  showAlerts?: boolean;
}

const UsageMonitor = ({ showAlerts = true }: UsageMonitorProps) => {
  const { data: usageStats, isLoading } = useUsageStats();

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <Skeleton className="h-4 w-32 mb-4" />
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-12 w-full rounded-xl" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!usageStats?.data) return null;

  const { usage, limits, remaining, isOverLimit } = usageStats.data;

  const metrics = [
    { key: 'leads', label: 'Leads', icon: <AlertTriangle size={16} /> },
    { key: 'agents', label: 'Agents', icon: <CheckCircle size={16} /> },
    { key: 'zones', label: 'Zones', icon: <CheckCircle size={16} /> },
    { key: 'properties', label: 'Properties', icon: <CheckCircle size={16} /> },
    { key: 'bookings', label: 'Bookings', icon: <CheckCircle size={16} /> },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-display font-bold text-foreground">Usage Monitor</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {isOverLimit && showAlerts && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3 bg-destructive/10 border border-destructive/20 rounded-xl flex items-center gap-3"
          >
            <XCircle className="text-destructive" size={20} />
            <div>
              <p className="text-sm font-medium text-destructive">Usage Limit Exceeded</p>
              <p className="text-xs text-destructive/70">Please upgrade your plan to continue</p>
            </div>
          </motion.div>
        )}

        <div className="space-y-3">
          {metrics.map((metric) => {
            const count = usage[metric.key] || 0;
            const limit = limits[`max${metric.key.charAt(0).toUpperCase() + metric.key.slice(1)}`] as number;
            const percentage = getUsagePercentage(count, limit);
            const isWarning = percentage >= 80 && percentage < 100;
            const isCritical = percentage >= 100;

            return (
              <div key={metric.key} className="space-y-1.5">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    {metric.icon}
                    <span className="font-medium text-foreground">{metric.label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">{count}</span>
                    <span className="text-xs text-muted-foreground">/ {limit === -1 ? '∞' : limit}</span>
                  </div>
                </div>
                <Progress
                  value={percentage}
                  className={`h-2 ${isCritical ? 'bg-destructive' : isWarning ? 'bg-warning' : 'bg-secondary'}`}
                >
                  <div
                    className={`h-full ${isCritical ? 'bg-destructive' : isWarning ? 'bg-warning' : 'bg-accent'}`}
                  />
                </Progress>
                {remaining[metric.key] !== undefined && remaining[metric.key] !== Infinity && (
                  <p className="text-xs text-muted-foreground">
                    {remaining[metric.key]} remaining this month
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default UsageMonitor;

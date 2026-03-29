import { motion } from 'framer-motion';
import { Users, Clock, CalendarCheck, CheckCircle, TrendingUp, IndianRupee, Star, AlertTriangle } from 'lucide-react';
import KpiCard from './KpiCard';

const sampleData = {
  totalLeads: 147,
  newToday: 8,
  avgResponseTime: 3.9,
  visitsScheduled: 12,
  visitsCompleted: 34,
  bookingsClosed: 29,
  conversionRate: 19.7,
  slaCompliance: 82,
  slaBreaches: 3,
  revenue: 4500000,
  pendingRevenue: 2800000,
  activeBookings: 15,
};

const sampleLeads = [
  { id: 'l1', name: 'Aarav Patel', phone: '+91 9876543210', source: 'whatsapp', status: 'new', budget: '₹8,000-12,000', location: 'Koramangala', agent: 'Priya Sharma' },
  { id: 'l2', name: 'Sneha Reddy', phone: '+91 8765432109', source: 'website', status: 'contacted', budget: '₹10,000-15,000', location: 'HSR Layout', agent: 'Rahul Verma' },
  { id: 'l3', name: 'Karan Mehta', phone: '+91 7654321098', source: 'instagram', status: 'requirement_collected', budget: '₹7,000-10,000', location: 'BTM Layout', agent: 'Anita Desai' },
  { id: 'l4', name: 'Divya Nair', phone: '+91 6543210987', source: 'facebook', status: 'property_suggested', budget: '₹12,000-18,000', location: 'Indiranagar', agent: 'Priya Sharma' },
  { id: 'l5', name: 'Rohit Kumar', phone: '+91 5432109876', source: 'phone', status: 'visit_scheduled', budget: '₹9,000-13,000', location: 'Marathahalli', agent: 'Vikram Singh' },
];

const SampleDataDisplay = () => {
  return (
    <div className="space-y-6">
      {/* Revenue */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KpiCard title="Confirmed Revenue" value={`₹${(sampleData.revenue / 1000).toFixed(0)}k`} icon={<IndianRupee size={17} />} color="hsl(var(--success))" />
        <KpiCard title="Pipeline Revenue" value={`₹${(sampleData.pendingRevenue / 1000).toFixed(0)}k`} icon={<TrendingUp size={17} />} color="hsl(var(--warning))" />
        <KpiCard title="Projected Revenue" value={`₹${((sampleData.revenue + sampleData.pendingRevenue * 0.6) / 1000).toFixed(0)}k`} icon={<IndianRupee size={17} />} color="hsl(var(--accent))" />
        <KpiCard title="Active Bookings" value={sampleData.activeBookings} icon={<CheckCircle size={17} />} color="hsl(var(--info))" />
      </div>

      {/* Sample Leads */}
      <div className="kpi-card">
        <h3 className="font-display font-semibold text-xs text-foreground mb-4">Recent Leads</h3>
        <div className="space-y-2">
          {sampleLeads.map((lead, i) => (
            <motion.div
              key={lead.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="flex items-center justify-between p-3 rounded-xl bg-secondary/50"
            >
              <div>
                <p className="text-xs font-medium text-foreground">{lead.name}</p>
                <p className="text-[10px] text-muted-foreground">{lead.location} · {lead.budget}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-muted-foreground">{lead.agent}</p>
                <p className="text-[10px] text-muted-foreground">{lead.source}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SampleDataDisplay;

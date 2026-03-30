import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface GradientCardProps {
  children: React.ReactNode;
  className?: string;
  gradient?: 'purple' | 'blue' | 'green' | 'orange' | 'pink';
  hoverEffect?: boolean;
}

const GradientCard = ({ 
  children, 
  className = '', 
  gradient = 'purple',
  hoverEffect = true
}: GradientCardProps) => {
  const gradients = {
    purple: 'from-purple-500/20 to-pink-500/20',
    blue: 'from-blue-500/20 to-cyan-500/20',
    green: 'from-green-500/20 to-emerald-500/20',
    orange: 'from-orange-500/20 to-amber-500/20',
    pink: 'from-pink-500/20 to-rose-500/20',
  };

  return (
    <motion.div
      whileHover={hoverEffect ? { scale: 1.02, boxShadow: '0 20px 40px -10px rgba(0,0,0,0.2)' } : {}}
      className={cn(
        'relative overflow-hidden rounded-2xl bg-card p-6 shadow-lg transition-all duration-300',
        className
      )}
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${gradients[gradient]} opacity-30`} />
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
};

export default GradientCard;

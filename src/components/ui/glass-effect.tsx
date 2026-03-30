import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface GlassEffectProps {
  children: React.ReactNode;
  className?: string;
  blur?: string;
  opacity?: number;
}

const GlassEffect = ({ 
  children, 
  className = '', 
  blur = 'backdrop-blur-md',
  opacity = 0.7
}: GlassEffectProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
      animate={{ opacity, backdropFilter: 'blur(12px)' }}
      transition={{ duration: 0.5 }}
      className={cn(
        `${blur} bg-white/10 dark:bg-black/10 border border-white/20 dark:border-white/10 rounded-2xl`,
        className
      )}
    >
      {children}
    </motion.div>
  );
};

export default GlassEffect;

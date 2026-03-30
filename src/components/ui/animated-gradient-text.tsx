import { motion } from 'framer-motion';

interface AnimatedGradientTextProps {
  children: React.ReactNode;
  className?: string;
  speed?: number;
  direction?: 'left' | 'right';
}

const AnimatedGradientText = ({ 
  children, 
  className = '', 
  speed = 20,
  direction = 'right'
}: AnimatedGradientTextProps) => {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      <motion.div
        animate={{
          x: direction === 'right' ? ['-100%', '0%'] : ['0%', '-100%'],
        }}
        transition={{
          duration: speed,
          repeat: Infinity,
          ease: 'linear',
        }}
        className="inline-block"
      >
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 animate-gradient-x">
          {children}
        </span>
      </motion.div>
    </div>
  );
};

export default AnimatedGradientText;

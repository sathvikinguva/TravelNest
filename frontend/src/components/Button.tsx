import { motion, type HTMLMotionProps } from 'framer-motion';
import type { ReactNode } from 'react';

interface ButtonProps extends HTMLMotionProps<'button'> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost';
}

const Button = ({ children, className = '', variant = 'primary', ...props }: ButtonProps) => {
  const variantClass =
    variant === 'primary'
      ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-200 hover:bg-indigo-700'
      : variant === 'secondary'
        ? 'bg-slate-900 text-white shadow-xl shadow-slate-200 hover:bg-slate-800'
        : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50';

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`px-6 py-3 rounded-2xl font-bold transition-all duration-300 ${variantClass} ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
};

export default Button;

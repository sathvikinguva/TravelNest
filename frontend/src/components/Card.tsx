import type { ReactNode } from 'react';

const Card = ({ children, className = '' }: { children: ReactNode; className?: string }) => {
  return <div className={`glass-card rounded-2xl shadow-soft ${className}`}>{children}</div>;
};

export default Card;

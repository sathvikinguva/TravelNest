import { motion } from 'framer-motion';
import { Bed, Plane } from 'lucide-react';

interface ToggleSwitchProps {
  value: 'rooms' | 'flights';
  onChange: (value: 'rooms' | 'flights') => void;
}

const ToggleSwitch = ({ value, onChange }: ToggleSwitchProps) => {
  return (
    <div className="p-1.5 bg-slate-100/50 rounded-2xl flex items-center relative gap-1 min-w-[280px]">
      <motion.div
        className="absolute h-[calc(100%-12px)] bg-white rounded-xl shadow-lg border border-slate-200 pointer-events-none"
        initial={false}
        animate={{ width: '135px', x: value === 'rooms' ? 0 : 139 }}
        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      />
      <button
        onClick={() => onChange('rooms')}
        className={`relative px-6 py-3.5 flex items-center justify-center gap-3 rounded-xl font-bold transition-all duration-300 w-1/2 ${
          value === 'rooms' ? 'text-indigo-600' : 'text-slate-400'
        }`}
      >
        <Bed className="w-5 h-5" />
        <span>Rooms</span>
      </button>
      <button
        onClick={() => onChange('flights')}
        className={`relative px-6 py-3.5 flex items-center justify-center gap-3 rounded-xl font-bold transition-all duration-300 w-1/2 ${
          value === 'flights' ? 'text-indigo-600' : 'text-slate-400'
        }`}
      >
        <Plane className="w-5 h-5" />
        <span>Flights</span>
      </button>
    </div>
  );
};

export default ToggleSwitch;

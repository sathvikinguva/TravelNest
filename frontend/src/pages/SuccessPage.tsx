import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, PartyPopper, ArrowRight, Briefcase } from 'lucide-react';

const SuccessPage = () => {
  const navigate = useNavigate();
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    setShowConfetti(true);
    const timer = setTimeout(() => setShowConfetti(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center text-center px-4 relative overflow-hidden">
      {/* Confetti particles mock */}
      <AnimatePresence>
        {showConfetti && (
          <div className="absolute inset-0 pointer-events-none z-0">
            {[...Array(30)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ 
                  opacity: 1, 
                  scale: 0, 
                  x: "50%", 
                  y: "50%",
                  rotate: 0 
                }}
                animate={{ 
                  opacity: 0, 
                  scale: 1, 
                  x: `${Math.random() * 100}%`, 
                  y: `${Math.random() * 100}%`,
                  rotate: 360 
                }}
                transition={{ duration: 3 + Math.random() * 2, ease: "easeOut" }}
                className={`w-3 h-3 rounded-md absolute ${
                  ['bg-indigo-500', 'bg-purple-500', 'bg-pink-500', 'bg-yellow-400', 'bg-blue-400'][i % 5]
                }`}
              />
            ))}
          </div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ 
          type: "spring", 
          stiffness: 260, 
          damping: 20,
          duration: 0.8
        }}
        className="w-32 h-32 bg-green-500 rounded-full flex items-center justify-center mb-10 shadow-2xl shadow-green-100 ring-8 ring-green-500/10 relative z-10"
      >
        <CheckCircle className="w-16 h-16 text-white" />
      </motion.div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="relative z-10 max-w-xl"
      >
        <h1 className="text-6xl font-black text-slate-900 mb-6 tracking-tight leading-tight">
          Booking Confirmed <span className="inline-block animate-bounce ml-2">🎉</span>
        </h1>
        <p className="text-xl text-slate-500 font-medium mb-12">
          Your reservation has been created successfully and synced with your backend.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
          <motion.button
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/my-bookings')}
            className="w-full sm:w-auto px-10 py-5 bg-slate-900 text-white rounded-[2rem] font-black text-lg shadow-xl hover:shadow-2xl transition-all flex items-center justify-center gap-3 group"
          >
            <Briefcase className="w-6 h-6" />
            <span>Go to My Bookings</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </motion.button>
          
          <button 
            onClick={() => navigate('/')}
            className="w-full sm:w-auto px-10 py-5 bg-white border-2 border-slate-100 text-slate-600 rounded-[2rem] font-bold text-lg hover:bg-slate-50 transition-all flex items-center justify-center gap-3"
          >
            <PartyPopper className="w-5 h-5" />
            <span>Plan Another Trip</span>
          </button>
        </div>
      </motion.div>

      <motion.div 
        animate={{ rotate: 360 }}
        transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
        className="fixed -bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-indigo-50/30 rounded-full blur-[120px] -z-10"
      />
      <motion.div 
        animate={{ rotate: -360 }}
        transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
        className="fixed -top-1/4 -left-1/4 w-1/2 h-1/2 bg-purple-50/30 rounded-full blur-[120px] -z-10"
      />
    </div>
  );
};

export default SuccessPage;

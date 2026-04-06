import { useState } from 'react';
import { motion /*, AnimatePresence */ } from 'framer-motion';
import { ArrowRight, Sparkles, MapPin, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ToggleSwitch from '../components/ToggleSwitch';
import Button from '../components/Button';

const HomePage = () => {
  const [activeTab, setActiveTab] = useState<'rooms' | 'flights'>('rooms');
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center">
      {/* Hero Section */}
      <section className="text-center py-16 px-4 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 text-indigo-600 font-bold text-sm mb-6 border border-indigo-100 shadow-sm"
        >
          <Sparkles className="w-4 h-4" />
          <span>New destinations added weekly</span>
        </motion.div>
        
        <motion.h1 
          className="text-6xl md:text-8xl font-black text-slate-900 tracking-tight leading-[1.05] mb-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          Book <span className="text-indigo-600">Rooms</span> & <span className="text-purple-600">Flights</span> Easily
        </motion.h1>
        
        <motion.p 
          className="text-xl text-slate-500 max-w-2xl mx-auto mb-12 font-medium"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          The only platform you need for your next global adventure. Transparent pricing, modern booking experience, and 24/7 support.
        </motion.p>

        {/* Search / Toggle Card */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-card shadow-2xl p-4 md:p-6 mb-16 relative group ring-1 ring-slate-200 hover:ring-indigo-200 overflow-hidden"
        >
          {/* Animated Background Blob */}
          <div className="absolute -top-12 -right-12 w-24 h-24 bg-indigo-500/10 rounded-full blur-2xl transition-transform group-hover:scale-150 duration-700" />
          
          <div className="flex flex-col md:flex-row items-center gap-6 relative z-10">
            {/* Toggle Switch */}
            <ToggleSwitch value={activeTab} onChange={setActiveTab} />

            {/* Quick search inputs */}
            <div className="flex-1 flex flex-col md:flex-row gap-4 w-full">
              <div className="flex-1 relative group">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                <input
                  type="text"
                  placeholder={activeTab === 'rooms' ? "Where are you going?" : "From where?"}
                  className="w-full bg-slate-100/50 border-none rounded-2xl py-4 pl-12 pr-4 font-semibold text-slate-700 placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-500/20 focus:bg-white transition-all transition-duration-300"
                />
              </div>
              <Button
                onClick={() => navigate(activeTab === 'rooms' ? '/rooms' : '/flights')}
                variant="secondary"
                className="group flex items-center justify-center gap-3 whitespace-nowrap"
              >
                <span>Find {activeTab === 'rooms' ? 'Rooms' : 'Flights'}</span>
                <Search className="w-5 h-5 group-hover:rotate-12 transition-transform" />
              </Button>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Featured Section */}
      <motion.section 
        className="w-full py-10"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <div className="mb-10">
          <div>
            <h2 className="text-4xl font-extrabold text-slate-900 mb-4">Plan Your Next Journey</h2>
            <p className="text-slate-500 font-medium">All inventory is loaded directly from your backend.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { title: 'Explore Rooms', description: 'Browse available stays from your backend inventory.', action: 'Go to Rooms', to: '/rooms' },
            { title: 'Search Flights', description: 'See live flight routes and pricing from backend.', action: 'Go to Flights', to: '/flights' },
            { title: 'Track Bookings', description: 'Manage your live booking history and statuses.', action: 'Go to My Bookings', to: '/my-bookings' },
          ].map((item, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -8 }}
              className="group cursor-pointer relative rounded-[2.5rem] overflow-hidden shadow-2xl shadow-indigo-100 border border-white/60 bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900"
              onClick={() => navigate(item.to)}
            >
              <div className="p-8 md:p-10 min-h-[280px] flex flex-col justify-between">
                <div>
                  <p className="text-indigo-300 font-bold text-sm mb-3 uppercase tracking-widest">Live Data</p>
                  <h3 className="text-3xl font-bold text-white mb-3">{item.title}</h3>
                  <p className="text-slate-200 font-medium">{item.description}</p>
                </div>
                <div className="inline-flex items-center gap-2 text-white font-bold mt-8">
                  <span>{item.action}</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>
    </div>
  );
};

export default HomePage;

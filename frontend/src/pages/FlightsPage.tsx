import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Plane, PlaneTakeoff, PlaneLanding, Clock, Calendar, ArrowRight, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Skeleton from '../components/Skeleton';
import Card from '../components/Card';
import { getFlights } from '../api/client';
import type { ApiFlight } from '../api/types';
import { useToast } from '../hooks/useToast';

const toTime = (value: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return '--:--';
  }
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const toDay = (value: string) => {
  const date = new Date(value);
  return date.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' });
};

const FlightCard = ({ flight, index }: { flight: ApiFlight; index: number }) => {
  const navigate = useNavigate();
  const departureTime = toTime(flight.departureTime || flight.date);
  const arrivalTime = toTime(flight.arrivalTime || flight.date);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      whileHover={{ scale: 1.01, transition: { duration: 0.2 } }}
      className="p-6 md:p-8 border border-white/60 ring-1 ring-slate-100/50 mb-6 flex flex-col md:flex-row items-center gap-8 relative hover:shadow-2xl hover:shadow-indigo-100 group overflow-hidden"
      onClick={() => navigate(`/booking/${flight.id}?type=flight`)}
    >
      <Card className="w-full p-6 md:p-8 !rounded-2xl">
        <div className="mb-5 overflow-hidden rounded-2xl border border-slate-100 h-48">
          <img
            src={flight.imageUrl || `https://picsum.photos/seed/flight-${flight.id}/1200/800`}
            alt={`${flight.source} to ${flight.destination}`}
            onError={(event) => {
              event.currentTarget.src = `https://picsum.photos/seed/flight-fallback-${flight.id}/1200/800`;
            }}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="absolute top-0 right-0 p-3 bg-indigo-50 border-bl border-indigo-100 rounded-bl-2xl">
          <ShieldCheck className="w-5 h-5 text-indigo-500" />
        </div>

        <div className="flex flex-col items-center md:items-start min-w-[150px]">
          <div className="p-4 bg-slate-900 rounded-3xl mb-4 group-hover:rotate-12 transition-transform shadow-lg shadow-slate-200">
            <Plane className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-xl font-black text-slate-800 tracking-tight">{flight.flightName || 'SkyWay'}</h3>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">FL-{flight.id}</span>
        </div>

        <div className="flex-1 w-full grid grid-cols-1 md:grid-cols-3 items-center gap-10">
          <div className="flex flex-col items-center md:items-start">
            <div className="flex items-center gap-2 text-slate-400 mb-2 font-bold text-xs uppercase tracking-widest">
              <PlaneTakeoff className="w-4 h-4 text-indigo-400" />
              <span>Departure</span>
            </div>
            <span className="text-3xl font-black text-slate-900 mb-1">{departureTime}</span>
            <span className="text-sm font-bold text-slate-500">{flight.source}</span>
          </div>

          <div className="flex flex-col items-center relative gap-2">
            <div className="w-full flex items-center gap-3">
              <div className="h-[2px] flex-1 bg-gradient-to-r from-transparent via-slate-200 to-slate-200" />
              <motion.div animate={{ x: [0, 5, 0] }} transition={{ repeat: Infinity, duration: 2 }} className="p-1 px-3 bg-indigo-50 rounded-full border border-indigo-100">
                <Plane className="w-4 h-4 text-indigo-600 rotate-90" />
              </motion.div>
              <div className="h-[2px] flex-1 bg-gradient-to-r from-slate-200 via-slate-200 to-transparent" />
            </div>
            <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-100/50 px-3 py-1 rounded-full border border-slate-200 shadow-sm">
              <Clock className="w-3 h-3 text-indigo-500" />
              <span>Direct service</span>
            </div>
          </div>

          <div className="flex flex-col items-center md:items-end">
            <div className="flex items-center gap-2 text-slate-400 mb-2 font-bold text-xs uppercase tracking-widest">
              <PlaneLanding className="w-4 h-4 text-purple-400" />
              <span>Arrival</span>
            </div>
            <span className="text-3xl font-black text-slate-900 mb-1">{arrivalTime}</span>
            <span className="text-sm font-bold text-slate-500">{flight.destination}</span>
          </div>
        </div>

        <div className="min-w-[180px] flex flex-col items-center md:items-end justify-center border-l md:border-l border-slate-100 pl-0 md:pl-8 gap-4">
          <div className="text-right flex flex-col items-center md:items-end">
            <span className="text-3xl font-black text-indigo-600">${flight.price}</span>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">{flight.cabinClass || 'Economy'}</span>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-indigo-600 text-white w-full py-4 px-8 rounded-2xl font-black text-sm shadow-xl shadow-indigo-200 flex items-center justify-center gap-3 transition-colors hover:bg-indigo-700 active:scale-95"
          >
            <span>Select Flight</span>
            <ArrowRight className="w-4 h-4" />
          </motion.button>
        </div>
      </Card>
    </motion.div>
  );
};

const FlightsPage = () => {
  const [loading, setLoading] = useState(true);
  const [flights, setFlights] = useState<ApiFlight[]>([]);
  const { showToast } = useToast();

  useEffect(() => {
    const loadFlights = async () => {
      setLoading(true);
      try {
        const data = await getFlights();
        setFlights(data);
      } catch {
        showToast('Unable to load flights from backend.', 'error');
      } finally {
        setLoading(false);
      }
    };

    void loadFlights();
  }, [showToast]);

  return (
    <div className="py-12">
      <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <motion.h2 className="text-4xl font-extrabold text-slate-900 tracking-tight" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            Premium Airlines
          </motion.h2>
          <motion.p className="text-slate-500 font-medium" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
            Find the perfect flight for your journey with top-tier airlines.
          </motion.p>
        </div>

        <div className="flex items-center gap-3 bg-white/50 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/60 shadow-sm">
          <Calendar className="w-5 h-5 text-indigo-500" />
          <span className="text-sm font-bold text-slate-700">Live from backend inventory</span>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col gap-4 mb-20 px-1">
          {Array.from({ length: 3 }).map((_, idx) => (
            <div key={idx} className="glass-card p-6 rounded-2xl">
              <Skeleton className="h-6 w-1/3 mb-4" />
              <Skeleton className="h-12 mb-3" />
              <Skeleton className="h-12" />
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-4 mb-20 px-1">
          {flights.map((flight, index) => (
            <FlightCard key={flight.id} flight={flight} index={index} />
          ))}
        </div>
      )}

      {!loading && flights.length > 0 && (
        <p className="text-center text-slate-400 text-sm font-semibold">Sample date: {toDay(flights[0].date)}</p>
      )}
    </div>
  );
};

export default FlightsPage;

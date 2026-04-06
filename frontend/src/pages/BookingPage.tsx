import { useEffect, useMemo, useState } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Bed, Plane, Calendar, Users, MapPin, ChevronRight, ArrowLeft, Star, ShieldCheck, CreditCard } from 'lucide-react';
import { getFlightById, getRoomById } from '../api/client';
import type { ApiFlight, ApiRoom } from '../api/types';
import { useToast } from '../hooks/useToast';
import { getRoomImageById } from '../data/roomImages';

const flightHero = 'https://images.unsplash.com/photo-1436491865332-7a61a109c0f3?auto=format&fit=crop&w=1200&q=80';

type BookingUiType = 'room' | 'flight';

const BookingPage = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const type = searchParams.get('type') as BookingUiType | null;
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [room, setRoom] = useState<ApiRoom | null>(null);
  const [flight, setFlight] = useState<ApiFlight | null>(null);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState(1);

  const numericId = Number(id);

  useEffect(() => {
    if (!id || Number.isNaN(numericId) || (type !== 'room' && type !== 'flight')) {
      setLoading(false);
      return;
    }

    const loadItem = async () => {
      setLoading(true);
      try {
        if (type === 'room') {
          const data = await getRoomById(numericId);
          setRoom(data);
          setFlight(null);
        } else {
          const data = await getFlightById(numericId);
          setFlight(data);
          setRoom(null);
        }
      } catch {
        showToast('Unable to load item details.', 'error');
      } finally {
        setLoading(false);
      }
    };

    void loadItem();
  }, [id, numericId, showToast, type]);

  const item = useMemo(() => (type === 'room' ? room : flight), [type, room, flight]);

  if (!id || Number.isNaN(numericId) || (type !== 'room' && type !== 'flight')) {
    return <div className="p-20 text-center font-bold">Invalid booking request</div>;
  }

  if (loading) {
    return <div className="p-20 text-center font-bold">Loading booking details...</div>;
  }

  if (!item) {
    return <div className="p-20 text-center font-bold">Item not found</div>;
  }

  const title = type === 'room' ? room?.name : `${flight?.source} → ${flight?.destination}`;
  const locationLine = type === 'room' ? room?.location : `${flight?.source} → ${flight?.destination}`;
  const amount = (item as ApiRoom | ApiFlight).price;

  const handleProceed = () => {
    if (step === 1) {
      setStep(2);
      return;
    }

    navigate('/payment', {
      state: {
        itemId: numericId,
        type: type === 'room' ? 'ROOM' : 'FLIGHT',
      },
    });
  };

  return (
    <div className="max-w-6xl mx-auto py-12 px-4">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-400 font-bold hover:text-indigo-600 transition-all mb-10 group">
        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
        <span>Return to Listing</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
          <div className="relative aspect-[16/10] rounded-[3rem] overflow-hidden shadow-2xl shadow-indigo-100 ring-1 ring-slate-100/50">
            <img
              src={type === 'room' ? (room?.imageUrl || getRoomImageById(numericId)) : (flight?.imageUrl || flightHero)}
              alt=""
              onError={(event) => {
                event.currentTarget.src = `https://picsum.photos/seed/booking-room-fallback-${numericId}/1200/800`;
              }}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
          </div>

          <div className="glass-card p-8 border border-white/60">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">{title}</h1>
              {type === 'room' && (
                <div className="flex items-center gap-1.5 bg-yellow-400/10 text-yellow-600 px-3 py-1.5 rounded-xl font-bold border border-yellow-200 shadow-sm">
                  <Star className="w-4 h-4 fill-yellow-500" />
                  <span>4.8</span>
                </div>
              )}
            </div>

            <div className="flex flex-wrap gap-4 text-slate-500 font-semibold mb-6">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-indigo-500" />
                <span>{locationLine}</span>
              </div>
              <div className="flex items-center gap-2">
                {type === 'room' ? <Bed className="w-5 h-5 text-indigo-500" /> : <Plane className="w-5 h-5 text-indigo-500" />}
                <span>{type === 'room' ? 'Room stay' : 'Flight ticket'}</span>
              </div>
            </div>

            <p className="text-slate-500 font-medium leading-relaxed">
              Live availability and pricing synced from your backend API.
            </p>
          </div>
        </motion.div>

        <div className="space-y-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card p-10 border border-indigo-100/50 shadow-2xl relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-6 bg-indigo-50/50 border-bl border-indigo-100/50 rounded-bl-3xl">
              <ShieldCheck className="w-6 h-6 text-indigo-600" />
            </div>

            <div className="mb-10">
              <h2 className="text-2xl font-black text-slate-900 mb-2">Checkout Details</h2>
              <div className="flex gap-2">
                <div className={`h-1.5 flex-1 rounded-full ${step >= 1 ? 'bg-indigo-600' : 'bg-slate-200'} transition-all`} />
                <div className={`h-1.5 flex-1 rounded-full ${step >= 2 ? 'bg-indigo-600' : 'bg-slate-200'} transition-all`} />
              </div>
            </div>

            <AnimatePresence mode="wait">
              {step === 1 ? (
                <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
                  <div className="space-y-4">
                    <label className="block text-sm font-black text-slate-400 uppercase tracking-widest pl-1">Contact Name</label>
                    <input type="text" placeholder="John Doe" className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-4 px-6 font-bold text-slate-700" />
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <label className="block text-sm font-black text-slate-400 uppercase tracking-widest pl-1">
                        {type === 'room' ? 'Check-In' : 'Date'}
                      </label>
                      <div className="relative">
                        <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input type="date" className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-4 pl-12 pr-6 font-bold text-slate-700" />
                      </div>
                    </div>
                    <div className="space-y-4">
                      <label className="block text-sm font-black text-slate-400 uppercase tracking-widest pl-1">
                        {type === 'room' ? 'Guests' : 'Passengers'}
                      </label>
                      <div className="relative">
                        <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <select className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-4 pl-12 pr-6 font-bold text-slate-700 appearance-none">
                          <option>1 Adult</option>
                          <option>2 Adults</option>
                          <option>3 Adults</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
                  <div className="p-6 bg-slate-900 rounded-3xl text-white shadow-xl shadow-slate-200 flex items-center justify-between">
                    <div>
                      <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mb-1">Total to pay</p>
                      <h3 className="text-3xl font-black">${amount}</h3>
                    </div>
                    <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-sm">
                      <CreditCard className="w-8 h-8" />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <p className="text-sm font-bold text-slate-500 px-2 flex justify-between">
                      <span>Fare / Rate:</span>
                      <span>${(item as ApiRoom | ApiFlight).price}</span>
                    </p>
                  </div>

                  <div className="flex items-center gap-4 text-xs font-bold text-indigo-600 bg-indigo-50 p-4 rounded-2xl border border-indigo-100">
                    <ShieldCheck className="w-6 h-6 flex-shrink-0" />
                    <span>Your booking request will be created through backend API.</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="mt-12 flex items-center gap-4">
              {step === 2 && (
                <button onClick={() => setStep(1)} className="p-4 bg-slate-100 rounded-2xl text-slate-500 hover:bg-slate-200 transition-all">
                  <ArrowLeft className="w-6 h-6" />
                </button>
              )}
              <motion.button
                whileHover={{ scale: 1.02, x: 5 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleProceed}
                className="flex-1 bg-indigo-600 text-white p-6 rounded-[1.75rem] font-black text-lg shadow-xl shadow-indigo-200 flex items-center justify-center gap-4 group"
              >
                <span>{step === 1 ? 'Review & Book' : 'Continue'}</span>
                <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;

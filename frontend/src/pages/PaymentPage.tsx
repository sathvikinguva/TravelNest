import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { CreditCard, ShieldCheck, Lock, Sparkles, AlertCircle, ArrowLeft } from 'lucide-react';
import { getFlightById, getRoomById } from '../api/client';
import type { ApiFlight, ApiRoom, BookingType } from '../api/types';
import { useBooking } from '../context/BookingContext';
import Modal from '../components/Modal';
import Button from '../components/Button';
import { useToast } from '../hooks/useToast';

const PaymentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { createNewBooking } = useBooking();
  const { showToast } = useToast();

  const state = location.state as { itemId: number; type: BookingType } | null;

  const [isProcessing, setIsProcessing] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [item, setItem] = useState<ApiRoom | ApiFlight | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!state) {
      setLoading(false);
      return;
    }

    const loadItem = async () => {
      setLoading(true);
      try {
        if (state.type === 'ROOM') {
          setItem(await getRoomById(state.itemId));
        } else {
          setItem(await getFlightById(state.itemId));
        }
      } catch {
        showToast('Unable to load selected item.', 'error');
      } finally {
        setLoading(false);
      }
    };

    void loadItem();
  }, [showToast, state]);

  const total = useMemo(() => (item ? item.price + 45 : 0), [item]);

  if (!state) {
    return <div className="p-20 text-center font-bold">Session expired. Please restart booking.</div>;
  }

  if (loading) {
    return <div className="p-20 text-center font-bold">Loading order summary...</div>;
  }

  if (!item) {
    return <div className="p-20 text-center font-bold">Item not found</div>;
  }

  const handleConfirmBooking = async () => {
    setConfirmOpen(false);
    setIsProcessing(true);
    showToast('Creating booking...', 'info');

    try {
      const booking = await createNewBooking({
        type: state.type,
        itemId: state.itemId,
      });
      showToast('Booking created successfully.', 'success');
      navigate('/success', { state: { bookingId: booking.id } });
    } catch {
      showToast('Unable to create booking. Please sign in again.', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 flex flex-col items-center">
      <div className="mb-12 text-center max-w-lg">
        <motion.div initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} className="w-20 h-20 bg-indigo-600/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-indigo-100 shadow-sm">
          <CreditCard className="w-10 h-10 text-indigo-600" />
        </motion.div>
        <h1 className="text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">Confirm Booking</h1>
        <p className="text-slate-500 font-medium">No payment is processed. This step only creates the booking in backend.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 w-full items-start">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="glass-card p-10 border border-slate-100 shadow-2xl relative overflow-hidden">
          <h2 className="text-xl font-black text-slate-900 mb-8 flex items-center gap-3">
            <Lock className="w-5 h-5 text-indigo-500" />
            <span>Traveler Details</span>
          </h2>

          <div className="space-y-6">
            <div className="space-y-3">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest pl-1">Full Name</label>
              <input type="text" placeholder="Your full name" className="w-full bg-slate-50/50 border-2 border-slate-100 rounded-2xl py-4 px-6 font-bold text-slate-700" />
            </div>
            <div className="space-y-3">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest pl-1">Notes</label>
              <input type="text" placeholder="Any special request" className="w-full bg-slate-50/50 border-2 border-slate-100 rounded-2xl py-4 px-6 font-bold text-slate-700" />
            </div>
          </div>
        </motion.div>

        <div className="space-y-8">
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="glass-card p-10 bg-slate-900 border-none shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10 blur-sm scale-150 rotate-12">
              <Sparkles className="w-32 h-32 text-indigo-400" />
            </div>

            <div className="relative z-10">
              <h2 className="text-indigo-400 font-bold text-sm uppercase tracking-widest mb-2 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4" />
                <span>Order Summary</span>
              </h2>
              <h3 className="text-white text-3xl font-black mb-6 tracking-tight line-clamp-1">
                {state.type === 'ROOM' ? (item as ApiRoom).name : `${(item as ApiFlight).source} → ${(item as ApiFlight).destination}`}
              </h3>

              <div className="space-y-4 mb-8">
                <div className="flex justify-between items-center text-slate-400 font-bold text-sm">
                  <span>Fare / Rate</span>
                  <span className="text-white">${item.price}</span>
                </div>
                <div className="flex justify-between items-center text-slate-400 font-bold text-sm">
                  <span>Taxes & Fees</span>
                  <span className="text-white">$45</span>
                </div>
                <div className="h-[1px] bg-white/10 w-full my-6" />
                <div className="flex justify-between items-center text-white font-black text-2xl">
                  <span>Total</span>
                  <span className="text-indigo-400">${total}</span>
                </div>
              </div>

              <motion.div whileHover={{ scale: 1.03, y: -2 }} whileTap={{ scale: 0.98 }}>
                <Button
                  onClick={() => setConfirmOpen(true)}
                  disabled={isProcessing}
                  variant="ghost"
                  className="w-full p-6 rounded-[2rem] font-black text-lg shadow-xl hover:shadow-2xl flex items-center justify-center gap-4 group disabled:opacity-75 disabled:cursor-not-allowed"
                >
                  <AnimatePresence mode="wait">
                    {isProcessing ? (
                      <motion.div key="loading" initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} className="flex items-center gap-4">
                        <div className="w-6 h-6 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                        <span className="text-indigo-600">Creating booking...</span>
                      </motion.div>
                    ) : (
                      <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-3">
                        <span>Confirm Booking</span>
                        <ArrowLeft className="w-6 h-6 rotate-180 group-hover:translate-x-1 transition-transform" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Button>
              </motion.div>
            </div>
          </motion.div>

          <div className="flex items-center gap-3 text-slate-400 font-bold text-xs p-6 bg-slate-50/50 rounded-2xl border border-slate-100">
            <AlertCircle className="w-5 h-5 text-indigo-400 flex-shrink-0" />
            <span>This confirmation creates a booking with status BOOKED in backend.</span>
          </div>
        </div>
      </div>

      <Modal open={confirmOpen} onClose={() => setConfirmOpen(false)} title="Confirm Booking">
        <p className="mb-6">
          You are about to confirm <span className="font-black text-slate-900">${total}</span>. Continue?
        </p>
        <div className="flex gap-3">
          <Button variant="ghost" className="flex-1" onClick={() => setConfirmOpen(false)}>
            Cancel
          </Button>
          <Button variant="primary" className="flex-1" onClick={handleConfirmBooking}>
            Confirm
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default PaymentPage;

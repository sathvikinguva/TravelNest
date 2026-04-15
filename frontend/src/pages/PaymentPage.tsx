import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { CreditCard, ShieldCheck, Lock, AlertCircle, ArrowLeft, Smartphone } from 'lucide-react';
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

  const state = location.state as {
    itemId: number;
    type: BookingType;
    travelerName?: string;
    travelDate?: string;
    guestCount?: number;
  } | null;

  const [isProcessing, setIsProcessing] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [item, setItem] = useState<ApiRoom | ApiFlight | null>(null);
  const [loading, setLoading] = useState(true);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [country, setCountry] = useState('India');
  const [city, setCity] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [travelerNotes, setTravelerNotes] = useState('');
  const [travelDate, setTravelDate] = useState(state?.travelDate ?? '');
  const [guestCount, setGuestCount] = useState(state?.guestCount ?? 1);
  const [paymentMethod, setPaymentMethod] = useState('CARD');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [upiId, setUpiId] = useState('');

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

  const total = useMemo(() => (item ? item.price : 0), [item]);

  const isAlphabetName = (value: string) => /^[A-Za-z ]+$/.test(value.trim());
  const isDigits = (value: string) => /^[0-9]+$/.test(value);

  const travelerName = `${firstName} ${lastName}`.trim();
  const inputClass = 'w-full bg-white border border-slate-200 rounded-xl py-3.5 px-4 font-semibold text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500';
  const selectClass = 'w-full bg-white border border-slate-200 rounded-xl py-3.5 px-4 font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500';

  const isFormValid = useMemo(() => {
    if (!isAlphabetName(firstName) || !isAlphabetName(lastName)) return false;
    if (!isAlphabetName(city)) return false;
    if (!isDigits(zipCode)) return false;
    if (!isDigits(phone)) return false;
    if (!email.includes('@')) return false;
    if (!travelDate) return false;
    const selectedDate = new Date(`${travelDate}T00:00:00`);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (selectedDate < today) return false;
    if (!Number.isInteger(guestCount) || guestCount < 1) return false;
    if (paymentMethod !== 'CARD' && paymentMethod !== 'UPI') return false;
    if (paymentMethod === 'CARD') {
      if (!/^\d{12,19}$/.test(cardNumber)) return false;
      if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(cardExpiry)) return false;
      if (!/^\d{3,4}$/.test(cardCvv)) return false;
    }
    if (paymentMethod === 'UPI' && !/^[A-Za-z0-9._-]+@[A-Za-z]+$/.test(upiId.trim())) return false;
    return true;
  }, [
    firstName,
    lastName,
    city,
    zipCode,
    phone,
    email,
    travelDate,
    guestCount,
    paymentMethod,
    cardNumber,
    cardExpiry,
    cardCvv,
    upiId,
  ]);

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
    if (!isAlphabetName(firstName) || !isAlphabetName(lastName)) {
      showToast('First and last name must contain alphabets only.', 'error');
      return;
    }
    if (!isAlphabetName(city)) {
      showToast('City must contain alphabets only.', 'error');
      return;
    }
    if (!isDigits(zipCode) || !isDigits(phone)) {
      showToast('Zip code and phone must be integers only.', 'error');
      return;
    }
    if (!email.includes('@')) {
      showToast('Please enter a valid email address.', 'error');
      return;
    }
    if (!travelDate) {
      showToast('Travel date is required.', 'error');
      return;
    }
    const selectedDate = new Date(`${travelDate}T00:00:00`);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (selectedDate < today) {
      showToast('Past dates are not allowed.', 'error');
      return;
    }
    if (paymentMethod !== 'CARD' && paymentMethod !== 'UPI') {
      showToast('Only CARD or UPI payment is allowed.', 'error');
      return;
    }

    if (paymentMethod === 'CARD' && !/^\d{12,19}$/.test(cardNumber)) {
      showToast('Card number must be between 12 and 19 digits.', 'error');
      return;
    }
    if (paymentMethod === 'CARD' && !/^(0[1-9]|1[0-2])\/\d{2}$/.test(cardExpiry)) {
      showToast('Card expiry must be MM/YY.', 'error');
      return;
    }
    if (paymentMethod === 'CARD' && !/^\d{3,4}$/.test(cardCvv)) {
      showToast('CVV must be 3 or 4 digits.', 'error');
      return;
    }
    if (paymentMethod === 'UPI' && !/^[A-Za-z0-9._-]+@[A-Za-z]+$/.test(upiId.trim())) {
      showToast('Enter a valid UPI ID.', 'error');
      return;
    }

    setConfirmOpen(false);
    setIsProcessing(true);
    showToast('Creating booking...', 'info');

    try {
      const booking = await createNewBooking({
        type: state.type,
        itemId: state.itemId,
        travelerName: travelerName.trim(),
        travelerNotes: travelerNotes.trim(),
        travelDate,
        guestCount,
        paymentMethod,
        paymentReference: paymentMethod === 'CARD'
          ? `CARD-${cardNumber.slice(-4)}-${Date.now().toString().slice(-6)}`
          : `UPI-${Date.now().toString().slice(-6)}`,
        cardLast4: paymentMethod === 'CARD' ? cardNumber.slice(-4) : '',
        upiId: paymentMethod === 'UPI' ? upiId.trim() : '',
        baseAmount: String(item.price),
        taxAmount: '0',
        totalAmount: String(total),
        currency: 'USD',
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
    <div className="max-w-7xl mx-auto py-10 px-4 md:px-6">
      <div className="mb-12 text-center max-w-lg">
        <motion.div initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} className="w-20 h-20 bg-indigo-600/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-indigo-100 shadow-sm">
          <CreditCard className="w-10 h-10 text-indigo-600" />
        </motion.div>
        <h1 className="text-4xl font-extrabold text-slate-900 mb-4 tracking-tight select-none">Confirm Booking</h1>
        <p className="text-slate-500 font-medium">Complete payment and personal details to confirm your booking.</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1.55fr_1fr] gap-8 w-full items-start">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="glass-card p-6 md:p-8 border border-slate-100 shadow-xl relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10">
            <div>
              <h2 className="text-3xl font-black text-slate-900 mb-2 flex items-center gap-3 select-none">
                <CreditCard className="w-5 h-5 text-indigo-500" />
                <span>Card Information</span>
              </h2>
              <p className="text-sm text-slate-500 mb-6">Choose CARD or UPI and provide valid details.</p>

              <div className="flex gap-3 mb-4">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('CARD')}
                  className={`min-w-24 px-4 py-2.5 rounded-xl font-bold transition-colors ${paymentMethod === 'CARD' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
                >
                  Card
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('UPI')}
                  className={`min-w-24 px-4 py-2.5 rounded-xl font-bold transition-colors ${paymentMethod === 'UPI' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
                >
                  UPI
                </button>
              </div>

              {paymentMethod === 'CARD' ? (
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
                  <input
                    type="text"
                    placeholder="Card number"
                    value={cardNumber}
                    onChange={(event) => setCardNumber(event.target.value.replace(/\D/g, '').slice(0, 19))}
                    className={inputClass}
                  />
                  <p className="text-xs text-slate-500">Use a valid card number (12-19 digits).</p>
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="MM/YY"
                      value={cardExpiry}
                      onChange={(event) => {
                        const cleaned = event.target.value.replace(/[^0-9]/g, '').slice(0, 4);
                        const formatted = cleaned.length > 2 ? `${cleaned.slice(0, 2)}/${cleaned.slice(2)}` : cleaned;
                        setCardExpiry(formatted);
                      }}
                      className={inputClass}
                    />
                    <input
                      type="password"
                      placeholder="CVV"
                      value={cardCvv}
                      onChange={(event) => setCardCvv(event.target.value.replace(/\D/g, '').slice(0, 4))}
                      className={inputClass}
                    />
                  </div>
                </div>
              ) : (
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
                  <div className="flex items-center gap-2 text-slate-700 font-semibold select-none">
                    <Smartphone className="w-4 h-4" />
                    <span>UPI Payment</span>
                  </div>
                  <input
                    type="text"
                    placeholder="yourname@bank"
                    value={upiId}
                    onChange={(event) => setUpiId(event.target.value.replace(/\s/g, ''))}
                    className={inputClass}
                  />
                </div>
              )}
            </div>

            <div>
              <h2 className="text-3xl font-black text-slate-900 mb-2 flex items-center gap-3 select-none">
                <Lock className="w-5 h-5 text-indigo-500" />
                <span>Personal Information</span>
              </h2>
              <p className="text-sm text-slate-500 mb-6">All fields are required and validated.</p>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="First name"
                    value={firstName}
                    onChange={(event) => setFirstName(event.target.value.replace(/[^A-Za-z ]/g, ''))}
                    className={inputClass}
                  />
                  <input
                    type="text"
                    placeholder="Last name"
                    value={lastName}
                    onChange={(event) => setLastName(event.target.value.replace(/[^A-Za-z ]/g, ''))}
                    className={inputClass}
                  />
                </div>

                <select
                  value={country}
                  onChange={(event) => setCountry(event.target.value)}
                  className={selectClass}
                >
                  <option>India</option>
                  <option>United States</option>
                  <option>United Kingdom</option>
                </select>

                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="City"
                    value={city}
                    onChange={(event) => setCity(event.target.value.replace(/[^A-Za-z ]/g, ''))}
                    className={inputClass}
                  />
                  <input
                    type="text"
                    placeholder="Zip code"
                    value={zipCode}
                    onChange={(event) => setZipCode(event.target.value.replace(/\D/g, '').slice(0, 10))}
                    className={inputClass}
                  />
                </div>

                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className={inputClass}
                />

                <input
                  type="text"
                  placeholder="Phone number"
                  value={phone}
                  onChange={(event) => setPhone(event.target.value.replace(/\D/g, '').slice(0, 15))}
                  className={inputClass}
                />

                <input
                  type="date"
                  value={travelDate}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(event) => setTravelDate(event.target.value)}
                  className={inputClass}
                />

                <select
                  value={guestCount}
                  onChange={(event) => setGuestCount(Number(event.target.value))}
                  className={selectClass}
                >
                  <option value={1}>1 Adult</option>
                  <option value={2}>2 Adults</option>
                  <option value={3}>3 Adults</option>
                  <option value={4}>4 Adults</option>
                </select>

                <input
                  type="text"
                  placeholder="Notes"
                  value={travelerNotes}
                  onChange={(event) => setTravelerNotes(event.target.value)}
                  className={inputClass}
                />
              </div>
            </div>
          </div>
        </motion.div>

        <div className="space-y-8">
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="glass-card p-8 bg-slate-900 border-none shadow-2xl relative overflow-hidden select-none">
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
                <div className="h-px bg-white/10 w-full my-6" />
                <div className="flex justify-between items-center text-white font-black text-2xl">
                  <span>Total</span>
                  <span className="text-indigo-400">${total}</span>
                </div>
              </div>

              <motion.div whileHover={{ scale: 1.03, y: -2 }} whileTap={{ scale: 0.98 }}>
                <Button
                  onClick={() => {
                    if (!isFormValid) {
                      showToast('Please complete all required fields with valid values.', 'error');
                      return;
                    }
                    setConfirmOpen(true);
                  }}
                  disabled={isProcessing}
                  variant="ghost"
                  className="w-full p-5 rounded-4xl font-black text-lg shadow-xl hover:shadow-2xl flex items-center justify-center gap-4 group disabled:opacity-75 disabled:cursor-not-allowed"
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

          <div className="flex items-center gap-3 text-slate-500 font-bold text-xs p-5 bg-slate-50 rounded-2xl border border-slate-100 select-none">
            <AlertCircle className="w-5 h-5 text-indigo-400 shrink-0" />
            <span>For CARD we store only last 4 digits. For UPI we store your UPI ID.</span>
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

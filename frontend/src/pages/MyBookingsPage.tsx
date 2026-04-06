import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Bed, Plane, ArrowRight, MapPin, Calendar, Clock, Briefcase } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useBooking } from '../context/BookingContext';
import { getFlights, getRooms } from '../api/client';
import type { ApiFlight, ApiRoom } from '../api/types';
import { useToast } from '../hooks/useToast';
import { getRoomThumbById } from '../data/roomImages';

const MyBookingsPage = () => {
  const { bookings, loading, cancelBooking, refreshMyBookings } = useBooking();
  const [roomsById, setRoomsById] = useState<Record<number, ApiRoom>>({});
  const [flightsById, setFlightsById] = useState<Record<number, ApiFlight>>({});
  const { showToast } = useToast();

  useEffect(() => {
    const loadCatalogs = async () => {
      try {
        const [rooms, flights] = await Promise.all([getRooms(), getFlights()]);
        setRoomsById(Object.fromEntries(rooms.map((room) => [room.id, room])));
        setFlightsById(Object.fromEntries(flights.map((flight) => [flight.id, flight])));
      } catch {
        showToast('Unable to load booking details.', 'error');
      }
    };

    void loadCatalogs();
    void refreshMyBookings();
  }, [refreshMyBookings, showToast]);

  const sortedBookings = useMemo(
    () => [...bookings].sort((a, b) => b.id - a.id),
    [bookings]
  );

  const roomBookings = useMemo(
    () => sortedBookings.filter((booking) => booking.type === 'ROOM'),
    [sortedBookings]
  );

  const flightBookings = useMemo(
    () => sortedBookings.filter((booking) => booking.type === 'FLIGHT'),
    [sortedBookings]
  );

  const toAmountLabel = (value: string | null | undefined, fallback: number) => {
    const parsed = Number(value);
    if (Number.isFinite(parsed) && parsed > 0) {
      return parsed.toFixed(2);
    }
    return fallback.toFixed(2);
  };

  const handleCancel = async (bookingId: number) => {
    try {
      await cancelBooking(bookingId);
      showToast('Booking cancelled.', 'success');
    } catch {
      showToast('Unable to cancel booking.', 'error');
    }
  };

  const renderBookingCard = (booking: (typeof sortedBookings)[number], index: number) => {
    const room = booking.type === 'ROOM' ? roomsById[booking.itemId] : null;
    const flight = booking.type === 'FLIGHT' ? flightsById[booking.itemId] : null;
    const title = booking.type === 'ROOM' ? room?.name ?? `Room #${booking.itemId}` : `${flight?.source ?? 'Flight'} -> ${flight?.destination ?? booking.itemId}`;
    const location = booking.type === 'ROOM' ? room?.location ?? 'Unknown location' : `${flight?.source ?? 'Source'} -> ${flight?.destination ?? 'Destination'}`;
    const fallbackTotal = booking.type === 'ROOM'
      ? (room?.price ?? 0)
      : (flight?.price ?? 0);
    const amountLabel = toAmountLabel(booking.totalAmount, fallbackTotal);
    const travelerLabel = booking.travelerName?.trim() || 'Not provided';
    const guestLabel = booking.guestCount ? String(booking.guestCount) : 'Not set';
    const methodLabel = booking.paymentMethod?.trim() || 'Not set';
    const referenceLabel = booking.paymentReference?.trim() || 'Not set';
    const travelDateLabel = booking.travelDate?.trim() || 'Not set';

    return (
      <motion.div
        key={booking.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.08 }}
        whileHover={{ x: 10 }}
        className="glass-card p-6 md:p-8 border border-white/60 shadow-xl shadow-indigo-50/30 flex flex-col md:flex-row items-center gap-10 hover:shadow-2xl transition-all group overflow-hidden"
      >
        <div className={`absolute top-0 right-0 px-8 py-2 text-white text-[10px] font-black uppercase tracking-widest translate-x-[30%] translate-y-[30%] rotate-45 shadow-sm ${booking.status === 'BOOKED' ? 'bg-indigo-500' : 'bg-slate-500'}`}>
          {booking.status}
        </div>

        <div className="w-full md:w-32 h-32 shrink-0 relative">
          {booking.type === 'ROOM' ? (
            <img
              src={room?.imageUrl || getRoomThumbById(booking.itemId)}
              alt={title}
              onError={(event) => {
                event.currentTarget.src = `https://picsum.photos/seed/booking-thumb-fallback-${booking.itemId}/320/320`;
              }}
              className="w-full h-full object-cover rounded-3xl shadow-lg border-2 border-white ring-1 ring-slate-100"
            />
          ) : (
            <div className="w-full h-full bg-slate-900 rounded-3xl flex items-center justify-center shadow-lg border-2 border-white ring-1 ring-slate-100">
              <Plane className="w-12 h-12 text-white" />
            </div>
          )}
        </div>

        <div className="flex-1 space-y-4">
          <div className="flex items-center gap-3">
            {booking.type === 'ROOM' ? <Bed className="w-5 h-5 text-indigo-500" /> : <Plane className="w-5 h-5 text-indigo-500" />}
            <h3 className="text-2xl font-black text-slate-800 tracking-tight">{title}</h3>
            <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded-lg uppercase tracking-widest">{booking.id}</span>
          </div>

          <div className="flex flex-wrap gap-x-10 gap-y-4 font-bold text-sm text-slate-500">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-indigo-400" />
              <span>{location}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-purple-400" />
              <span>Booking ID: {booking.id}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-pink-400" />
              <span>Date: {travelDateLabel}</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-x-10 gap-y-3 font-bold text-xs text-slate-400 border-t border-slate-100 pt-3">
            <span>Traveler: {travelerLabel}</span>
            <span>Guests: {guestLabel}</span>
            <span>Payment: {methodLabel}</span>
            <span>Ref: {referenceLabel}</span>
          </div>
        </div>

        <div className="w-full md:w-auto flex md:flex-col items-center md:items-end gap-6 md:gap-2">
          <div className="flex-1 md:flex-none">
            <p className="text-[10px] uppercase font-black tracking-widest text-slate-400 mb-1 leading-none text-right">Estimated Price</p>
            <h4 className="text-2xl font-black text-slate-900">${amountLabel}</h4>
          </div>
          {booking.status === 'BOOKED' ? (
            <motion.button
              whileHover={{ scale: 1.05, gap: '12px' }}
              whileTap={{ scale: 0.95 }}
              onClick={() => void handleCancel(booking.id)}
              className="p-4 bg-red-50 text-red-600 rounded-2xl flex items-center gap-2 font-black text-xs hover:bg-red-600 hover:text-white transition-all shadow-sm"
            >
              <span>CANCEL</span>
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          ) : (
            <span className="p-4 bg-slate-100 text-slate-500 rounded-2xl font-black text-xs">CANCELLED</span>
          )}
        </div>
      </motion.div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto py-12 px-4">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
        <div>
          <motion.h1 className="text-5xl font-black text-slate-900 tracking-tight" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            Your Journeys
          </motion.h1>
          <motion.p className="text-slate-500 font-medium text-lg" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
            Synced with your backend booking records.
          </motion.p>
        </div>

        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }} className="p-4 bg-indigo-600 rounded-2xl flex items-center gap-4 text-white shadow-xl shadow-indigo-100 border border-white/20">
          <div className="p-3 bg-white/10 rounded-xl backdrop-blur-md border border-white/10">
            <Briefcase className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest opacity-80 leading-none mb-1">Total Bookings</p>
            <h3 className="text-2xl font-black">{sortedBookings.length}</h3>
          </div>
        </motion.div>
      </div>

      {!loading && sortedBookings.length === 0 ? (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-20 text-center flex flex-col items-center border border-dashed border-slate-200">
          <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-10 text-slate-300">
            <Briefcase className="w-10 h-10" />
          </div>
          <h2 className="text-3xl font-black text-slate-900 mb-4">No bookings yet</h2>
          <p className="text-slate-500 font-medium mb-12 max-w-sm">Your bucket list is waiting! Start exploring the world by booking your first room or flight.</p>
          <div className="flex gap-4">
            <Link to="/rooms" className="px-8 py-4 bg-indigo-600 text-white rounded-2xl font-black text-sm shadow-xl hover:bg-indigo-700 transition-all">
              Explore Rooms
            </Link>
            <Link to="/flights" className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-black text-sm shadow-xl hover:bg-slate-800 transition-all">
              Find Flights
            </Link>
          </div>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 gap-8">
          <div className="space-y-4">
            <h2 className="text-xl font-black text-slate-900">Room Bookings</h2>
            {roomBookings.length > 0 ? roomBookings.map(renderBookingCard) : <p className="text-slate-500 font-semibold">No room bookings yet.</p>}
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-black text-slate-900">Flight Bookings</h2>
            {flightBookings.length > 0 ? flightBookings.map(renderBookingCard) : <p className="text-slate-500 font-semibold">No flight bookings yet.</p>}
          </div>
        </div>
      )}
    </div>
  );
};

export default MyBookingsPage;

import { useEffect, useMemo, useState } from 'react';
import {
  AlertCircle,
  Bed,
  ChevronRight,
  History,
  PencilLine,
  Plane,
  PlusCircle,
  Trash2,
  Users,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  createAdminFlight,
  createAdminRoom,
  deleteAdminUser,
  getAdminBookings,
  getAdminFlightPayments,
  getAdminRoomPayments,
  getAdminRoomRatings,
  getAdminUsers,
  getFlights,
  getRooms,
  updateAdminFlight,
  updateAdminRoom,
} from '../api/client';
import type {
  ApiAdminUser,
  ApiBooking,
  ApiFlight,
  ApiFlightPayment,
  ApiRoom,
  ApiRoomPayment,
  ApiRoomRating,
} from '../api/types';
import { useToast } from '../hooks/useToast';

const toLocalDateTimeInput = (value: string | undefined) => {
  if (!value) return '';
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return '';
  const year = parsed.getFullYear();
  const month = String(parsed.getMonth() + 1).padStart(2, '0');
  const day = String(parsed.getDate()).padStart(2, '0');
  const hours = String(parsed.getHours()).padStart(2, '0');
  const minutes = String(parsed.getMinutes()).padStart(2, '0');
  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

const AdminPanelPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState('dashboard');
  const [adminBookings, setAdminBookings] = useState<ApiBooking[]>([]);
  const [adminUsers, setAdminUsers] = useState<ApiAdminUser[]>([]);
  const [rooms, setRooms] = useState<ApiRoom[]>([]);
  const [flights, setFlights] = useState<ApiFlight[]>([]);
  const [roomRatings, setRoomRatings] = useState<ApiRoomRating[]>([]);
  const [roomPayments, setRoomPayments] = useState<ApiRoomPayment[]>([]);
  const [flightPayments, setFlightPayments] = useState<ApiFlightPayment[]>([]);

  const [deletingUserId, setDeletingUserId] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [roomForm, setRoomForm] = useState({
    name: '',
    imageUrl: '',
    location: '',
    roomType: '',
    description: '',
    price: '',
    available: true,
  });

  const [flightForm, setFlightForm] = useState({
    flightName: '',
    source: '',
    destination: '',
    departureTime: '',
    arrivalTime: '',
    imageUrl: '',
    fare: '',
    cabinClass: '',
  });

  const [selectedRoomId, setSelectedRoomId] = useState<number | null>(null);
  const [selectedFlightId, setSelectedFlightId] = useState<number | null>(null);

  const roomForEdit = useMemo(
    () => rooms.find((room) => room.id === selectedRoomId) ?? null,
    [rooms, selectedRoomId]
  );

  const flightForEdit = useMemo(
    () => flights.find((flight) => flight.id === selectedFlightId) ?? null,
    [flights, selectedFlightId]
  );

  useEffect(() => {
    if (user?.role !== 'ADMIN') return;

    const loadDashboardData = async () => {
      try {
        const [bookingsData, usersData, roomsData, flightsData] = await Promise.all([
          getAdminBookings(),
          getAdminUsers(),
          getRooms(),
          getFlights(),
        ]);
        const [ratingsData, roomPaymentsData, flightPaymentsData] = await Promise.all([
          getAdminRoomRatings(),
          getAdminRoomPayments(),
          getAdminFlightPayments(),
        ]);
        setAdminBookings(bookingsData);
        setAdminUsers(usersData);
        setRooms(roomsData);
        setFlights(flightsData);
        setRoomRatings(ratingsData);
        setRoomPayments(roomPaymentsData);
        setFlightPayments(flightPaymentsData);
      } catch {
        showToast('Unable to load admin data.', 'error');
      }
    };

    void loadDashboardData();
  }, [showToast, user?.role]);

  useEffect(() => {
    if (!roomForEdit) return;
    setRoomForm({
      name: roomForEdit.name,
      imageUrl: roomForEdit.imageUrl ?? '',
      location: roomForEdit.location,
      roomType: roomForEdit.roomType ?? '',
      description: roomForEdit.description ?? '',
      price: String(roomForEdit.price),
      available: roomForEdit.available,
    });
  }, [roomForEdit]);

  useEffect(() => {
    if (!flightForEdit) return;
    setFlightForm({
      flightName: flightForEdit.flightName ?? '',
      source: flightForEdit.source,
      destination: flightForEdit.destination,
      departureTime: toLocalDateTimeInput(flightForEdit.departureTime),
      arrivalTime: toLocalDateTimeInput(flightForEdit.arrivalTime),
      imageUrl: flightForEdit.imageUrl ?? '',
      fare: String(flightForEdit.price),
      cabinClass: flightForEdit.cabinClass ?? '',
    });
  }, [flightForEdit]);

  if (user?.role !== 'ADMIN') {
    return (
      <div className="p-20 text-center flex flex-col items-center gap-6">
        <AlertCircle className="w-12 h-12 text-red-500" />
        <h1 className="text-3xl font-black text-slate-900">Unauthorized Access</h1>
        <p className="text-slate-500 font-medium">You must be an admin to view this page.</p>
        <button onClick={() => navigate('/')} className="px-8 py-4 bg-indigo-600 text-white rounded-2xl font-black">
          Return Home
        </button>
      </div>
    );
  }

  const activeBookingsCount = adminBookings.filter((booking) => booking.status === 'BOOKED').length;
  const cancelledBookingsCount = adminBookings.filter((booking) => booking.status === 'CANCELLED').length;
  const roomRatingsCount = roomRatings.length;
  const avgRoomRating = roomRatingsCount
    ? roomRatings.reduce((sum, rating) => sum + rating.rating, 0) / roomRatingsCount
    : 0;

  const dashboardMetrics = [
    { label: 'Rooms', value: rooms.length, accent: 'from-indigo-500 to-indigo-600' },
    { label: 'Flights', value: flights.length, accent: 'from-sky-500 to-sky-600' },
    { label: 'Bookings', value: adminBookings.length, accent: 'from-emerald-500 to-emerald-600' },
    { label: 'Ratings', value: roomRatingsCount, accent: 'from-amber-500 to-amber-600' },
  ];

  const dashboardBars = dashboardMetrics
    .map((metric) => ({ ...metric, percent: Math.max(metric.value, 1) }))
    .sort((left, right) => right.percent - left.percent);
  const chartMax = Math.max(...dashboardBars.map((bar) => bar.percent), 1);

  const resetRoomForm = () => {
    setRoomForm({
      name: '',
      imageUrl: '',
      location: '',
      roomType: '',
      description: '',
      price: '',
      available: true,
    });
  };

  const resetFlightForm = () => {
    setFlightForm({
      flightName: '',
      source: '',
      destination: '',
      departureTime: '',
      arrivalTime: '',
      imageUrl: '',
      fare: '',
      cabinClass: '',
    });
  };

  const validateRoomForm = () => {
    const price = Number(roomForm.price);
    if (
      !roomForm.name.trim() ||
      !roomForm.imageUrl.trim() ||
      !roomForm.location.trim() ||
      !roomForm.roomType.trim() ||
      !roomForm.description.trim() ||
      Number.isNaN(price)
    ) {
      showToast('Fill all room fields with valid values.', 'error');
      return null;
    }

    return {
      name: roomForm.name.trim(),
      imageUrl: roomForm.imageUrl.trim(),
      location: roomForm.location.trim(),
      roomType: roomForm.roomType.trim(),
      description: roomForm.description.trim(),
      price,
      available: roomForm.available,
    };
  };

  const validateFlightForm = () => {
    const price = Number(flightForm.fare);
    if (
      !flightForm.source.trim() ||
      !flightForm.destination.trim() ||
      !flightForm.flightName.trim() ||
      !flightForm.departureTime ||
      !flightForm.arrivalTime ||
      !flightForm.imageUrl.trim() ||
      !flightForm.cabinClass.trim() ||
      Number.isNaN(price)
    ) {
      showToast('Fill all flight fields with valid values.', 'error');
      return null;
    }

    return {
      flightName: flightForm.flightName.trim(),
      source: flightForm.source.trim(),
      destination: flightForm.destination.trim(),
      departureTime: flightForm.departureTime,
      arrivalTime: flightForm.arrivalTime,
      imageUrl: flightForm.imageUrl.trim(),
      cabinClass: flightForm.cabinClass.trim(),
      price,
    };
  };

  const refreshCatalogs = async () => {
    const [roomsData, flightsData] = await Promise.all([getRooms(), getFlights()]);
    setRooms(roomsData);
    setFlights(flightsData);
  };

  const handleCreateRoom = async () => {
    const payload = validateRoomForm();
    if (!payload) return;

    setIsSubmitting(true);
    try {
      await createAdminRoom(payload);
      await refreshCatalogs();
      resetRoomForm();
      showToast('Room created successfully.', 'success');
    } catch {
      showToast('Unable to create room.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateRoom = async () => {
    if (!selectedRoomId) {
      showToast('Select a room to update.', 'error');
      return;
    }

    const payload = validateRoomForm();
    if (!payload) return;

    setIsSubmitting(true);
    try {
      await updateAdminRoom(selectedRoomId, payload);
      await refreshCatalogs();
      showToast('Room updated successfully.', 'success');
    } catch {
      showToast('Unable to update room.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreateFlight = async () => {
    const payload = validateFlightForm();
    if (!payload) return;

    setIsSubmitting(true);
    try {
      await createAdminFlight(payload);
      await refreshCatalogs();
      resetFlightForm();
      showToast('Flight created successfully.', 'success');
    } catch {
      showToast('Unable to create flight.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateFlight = async () => {
    if (!selectedFlightId) {
      showToast('Select a flight to update.', 'error');
      return;
    }

    const payload = validateFlightForm();
    if (!payload) return;

    setIsSubmitting(true);
    try {
      await updateAdminFlight(selectedFlightId, payload);
      await refreshCatalogs();
      showToast('Flight updated successfully.', 'success');
    } catch {
      showToast('Unable to update flight.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteUser = async (userId: number) => {
    setDeletingUserId(userId);
    try {
      await deleteAdminUser(userId);
      setAdminUsers((prev) => prev.filter((entry) => entry.id !== userId));
      showToast('User removed successfully.', 'success');
    } catch {
      showToast('Unable to remove user.', 'error');
    } finally {
      setDeletingUserId(null);
    }
  };

  const sidebarLinks = [
    { id: 'dashboard', name: 'Dashboard', icon: AlertCircle },
    { id: 'add-room', name: 'Add Room', icon: PlusCircle },
    { id: 'add-flight', name: 'Add Flight', icon: PlusCircle },
    { id: 'update-room', name: 'Update Room', icon: PencilLine },
    { id: 'update-flight', name: 'Update Flight', icon: PencilLine },
    { id: 'room-ratings', name: 'Room Ratings', icon: History },
    { id: 'room-payments', name: 'Room Payments', icon: History },
    { id: 'flight-payments', name: 'Flight Payments', icon: History },
    { id: 'bookings', name: 'View Bookings', icon: History },
    { id: 'users', name: 'User Management', icon: Users },
  ];

  return (
    <div className="flex min-h-screen bg-slate-50 gap-8 py-10">
      <aside className="hidden lg:flex w-72 flex-col gap-2 shrink-0 glass-card p-6 border border-white max-h-[85vh] sticky top-32 overflow-y-auto">
        <h2 className="text-xl font-black text-slate-900 mb-6">Admin Console</h2>
        <nav className="space-y-2">
          {sidebarLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => setActiveTab(link.id)}
              className={`w-full flex items-center gap-3 p-3 rounded-2xl font-black text-sm transition-all ${
                activeTab === link.id ? 'bg-slate-900 text-white' : 'text-slate-500 hover:bg-slate-100'
              }`}
            >
              <link.icon className="w-4 h-4" />
              <span>{link.name}</span>
            </button>
          ))}
        </nav>
      </aside>

      <main className="flex-1 space-y-8 min-w-0 pr-4">
        <header>
          <h1 className="text-3xl font-black text-slate-900 capitalize">{activeTab.replace('-', ' ')}</h1>
          <p className="text-slate-400 font-semibold">Manage rooms, flights, bookings and users.</p>
        </header>

        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="glass-card p-6">
                <p className="text-xs font-black uppercase text-slate-400">Rooms</p>
                <h3 className="text-3xl font-black text-slate-900">{rooms.length}</h3>
              </div>
              <div className="glass-card p-6">
                <p className="text-xs font-black uppercase text-slate-400">Flights</p>
                <h3 className="text-3xl font-black text-slate-900">{flights.length}</h3>
              </div>
              <div className="glass-card p-6">
                <p className="text-xs font-black uppercase text-slate-400">Active Bookings</p>
                <h3 className="text-3xl font-black text-slate-900">{activeBookingsCount}</h3>
              </div>
              <div className="glass-card p-6">
                <p className="text-xs font-black uppercase text-slate-400">Cancelled</p>
                <h3 className="text-3xl font-black text-slate-900">{cancelledBookingsCount}</h3>
              </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-[1.4fr_1fr] gap-6">
              <div className="glass-card p-6 md:p-8">
                <div className="flex items-center justify-between gap-4 mb-6">
                  <div>
                    <p className="text-xs font-black uppercase text-slate-400">Overview</p>
                    <h3 className="text-2xl font-black text-slate-900">Inventory and activity graph</h3>
                  </div>
                  <div className="rounded-2xl bg-slate-50 px-4 py-3 text-right border border-slate-100">
                    <p className="text-[11px] font-black uppercase text-slate-400">Average room rating</p>
                    <p className="text-2xl font-black text-indigo-600">{avgRoomRating ? avgRoomRating.toFixed(1) : '0.0'}</p>
                  </div>
                </div>

                <div className="flex items-end gap-4 h-72 rounded-3xl bg-linear-to-b from-slate-50 to-white p-5 border border-slate-100 overflow-hidden">
                  {dashboardBars.map((bar) => {
                    const height = `${(bar.percent / chartMax) * 100}%`;
                    return (
                      <div key={bar.label} className="flex-1 flex flex-col items-center justify-end gap-3 h-full min-w-0">
                        <div className="w-full flex justify-center items-end h-full">
                          <div className="w-full max-w-24 h-full flex items-end justify-center">
                            <div
                              className={`w-full rounded-t-3xl bg-linear-to-t ${bar.accent} shadow-lg shadow-slate-200`}
                              style={{ height }}
                            />
                          </div>
                        </div>
                        <div className="text-center">
                          <p className="text-xs font-black uppercase text-slate-500">{bar.label}</p>
                          <p className="text-lg font-black text-slate-900">{bar.value}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-4">
                <div className="glass-card p-6">
                  <p className="text-xs font-black uppercase text-slate-400 mb-2">Quick stats</p>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-600">Room payments</span>
                      <span className="font-black text-slate-900">{roomPayments.length}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-600">Flight payments</span>
                      <span className="font-black text-slate-900">{flightPayments.length}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-600">Room ratings</span>
                      <span className="font-black text-slate-900">{roomRatingsCount}</span>
                    </div>
                  </div>
                </div>

                <div className="glass-card p-6 bg-slate-900 border-none text-white">
                  <p className="text-xs font-black uppercase text-slate-400 mb-2">Health</p>
                  <h3 className="text-2xl font-black mb-2">Live dashboard</h3>
                  <p className="text-slate-300 text-sm leading-relaxed">
                    Monitor inventory, bookings, and payment flow from one place. This graph uses live counts from the backend.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'add-room' && (
          <div className="glass-card p-8 space-y-5">
            <h2 className="text-2xl font-black text-slate-900 flex items-center gap-3"><Bed className="w-6 h-6 text-indigo-600" />Add Room</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input value={roomForm.name} onChange={(e) => setRoomForm((p) => ({ ...p, name: e.target.value }))} placeholder="Hotel name" className="rounded-xl border border-slate-200 px-4 py-3 font-semibold" />
              <input value={roomForm.imageUrl} onChange={(e) => setRoomForm((p) => ({ ...p, imageUrl: e.target.value }))} placeholder="Room image URL" className="rounded-xl border border-slate-200 px-4 py-3 font-semibold" />
              <input value={roomForm.location} onChange={(e) => setRoomForm((p) => ({ ...p, location: e.target.value }))} placeholder="Location" className="rounded-xl border border-slate-200 px-4 py-3 font-semibold" />
              <input value={roomForm.roomType} onChange={(e) => setRoomForm((p) => ({ ...p, roomType: e.target.value }))} placeholder="Room type (2 sharing, 3 sharing)" className="rounded-xl border border-slate-200 px-4 py-3 font-semibold" />
              <input type="number" value={roomForm.price} onChange={(e) => setRoomForm((p) => ({ ...p, price: e.target.value }))} placeholder="Fare / price" className="rounded-xl border border-slate-200 px-4 py-3 font-semibold" />
              <select value={roomForm.available ? 'available' : 'unavailable'} onChange={(e) => setRoomForm((p) => ({ ...p, available: e.target.value === 'available' }))} className="rounded-xl border border-slate-200 px-4 py-3 font-semibold">
                <option value="available">Available</option>
                <option value="unavailable">Unavailable</option>
              </select>
            </div>
            <textarea value={roomForm.description} onChange={(e) => setRoomForm((p) => ({ ...p, description: e.target.value }))} placeholder="Description" rows={4} className="w-full rounded-xl border border-slate-200 px-4 py-3 font-semibold" />
            <button onClick={() => void handleCreateRoom()} disabled={isSubmitting} className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-black inline-flex items-center gap-2 disabled:opacity-60">
              <span>{isSubmitting ? 'Saving...' : 'Create Room'}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {activeTab === 'add-flight' && (
          <div className="glass-card p-8 space-y-5">
            <h2 className="text-2xl font-black text-slate-900 flex items-center gap-3"><Plane className="w-6 h-6 text-indigo-600" />Add Flight</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input value={flightForm.flightName} onChange={(e) => setFlightForm((p) => ({ ...p, flightName: e.target.value }))} placeholder="Flight name" className="rounded-xl border border-slate-200 px-4 py-3 font-semibold" />
              <input value={flightForm.source} onChange={(e) => setFlightForm((p) => ({ ...p, source: e.target.value }))} placeholder="Source" className="rounded-xl border border-slate-200 px-4 py-3 font-semibold" />
              <input value={flightForm.destination} onChange={(e) => setFlightForm((p) => ({ ...p, destination: e.target.value }))} placeholder="Destination" className="rounded-xl border border-slate-200 px-4 py-3 font-semibold" />
              <input type="datetime-local" value={flightForm.departureTime} onChange={(e) => setFlightForm((p) => ({ ...p, departureTime: e.target.value }))} className="rounded-xl border border-slate-200 px-4 py-3 font-semibold" />
              <input type="datetime-local" value={flightForm.arrivalTime} onChange={(e) => setFlightForm((p) => ({ ...p, arrivalTime: e.target.value }))} className="rounded-xl border border-slate-200 px-4 py-3 font-semibold" />
              <input value={flightForm.imageUrl} onChange={(e) => setFlightForm((p) => ({ ...p, imageUrl: e.target.value }))} placeholder="Flight image URL" className="rounded-xl border border-slate-200 px-4 py-3 font-semibold" />
              <input type="number" value={flightForm.fare} onChange={(e) => setFlightForm((p) => ({ ...p, fare: e.target.value }))} placeholder="Fare" className="rounded-xl border border-slate-200 px-4 py-3 font-semibold" />
              <input value={flightForm.cabinClass} onChange={(e) => setFlightForm((p) => ({ ...p, cabinClass: e.target.value }))} placeholder="Cabin class" className="rounded-xl border border-slate-200 px-4 py-3 font-semibold" />
            </div>
            <button onClick={() => void handleCreateFlight()} disabled={isSubmitting} className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-black inline-flex items-center gap-2 disabled:opacity-60">
              <span>{isSubmitting ? 'Saving...' : 'Create Flight'}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {activeTab === 'update-room' && (
          <div className="glass-card p-8 space-y-5">
            <h2 className="text-2xl font-black text-slate-900">Update Room</h2>
            <select
              value={selectedRoomId ?? ''}
              onChange={(e) => setSelectedRoomId(e.target.value ? Number(e.target.value) : null)}
              className="w-full rounded-xl border border-slate-200 px-4 py-3 font-semibold"
            >
              <option value="">Select room</option>
              {rooms.map((room) => (
                <option key={room.id} value={room.id}>{room.name} ({room.location})</option>
              ))}
            </select>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input value={roomForm.name} onChange={(e) => setRoomForm((p) => ({ ...p, name: e.target.value }))} placeholder="Hotel name" className="rounded-xl border border-slate-200 px-4 py-3 font-semibold" />
              <input value={roomForm.imageUrl} onChange={(e) => setRoomForm((p) => ({ ...p, imageUrl: e.target.value }))} placeholder="Room image URL" className="rounded-xl border border-slate-200 px-4 py-3 font-semibold" />
              <input value={roomForm.location} onChange={(e) => setRoomForm((p) => ({ ...p, location: e.target.value }))} placeholder="Location" className="rounded-xl border border-slate-200 px-4 py-3 font-semibold" />
              <input value={roomForm.roomType} onChange={(e) => setRoomForm((p) => ({ ...p, roomType: e.target.value }))} placeholder="Room type" className="rounded-xl border border-slate-200 px-4 py-3 font-semibold" />
              <input type="number" value={roomForm.price} onChange={(e) => setRoomForm((p) => ({ ...p, price: e.target.value }))} placeholder="Fare / price" className="rounded-xl border border-slate-200 px-4 py-3 font-semibold" />
              <select value={roomForm.available ? 'available' : 'unavailable'} onChange={(e) => setRoomForm((p) => ({ ...p, available: e.target.value === 'available' }))} className="rounded-xl border border-slate-200 px-4 py-3 font-semibold">
                <option value="available">Available</option>
                <option value="unavailable">Unavailable</option>
              </select>
            </div>
            <textarea value={roomForm.description} onChange={(e) => setRoomForm((p) => ({ ...p, description: e.target.value }))} placeholder="Description" rows={4} className="w-full rounded-xl border border-slate-200 px-4 py-3 font-semibold" />
            <button onClick={() => void handleUpdateRoom()} disabled={isSubmitting} className="bg-slate-900 text-white px-6 py-3 rounded-xl font-black inline-flex items-center gap-2 disabled:opacity-60">
              <span>{isSubmitting ? 'Updating...' : 'Update Room'}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {activeTab === 'update-flight' && (
          <div className="glass-card p-8 space-y-5">
            <h2 className="text-2xl font-black text-slate-900">Update Flight</h2>
            <select
              value={selectedFlightId ?? ''}
              onChange={(e) => setSelectedFlightId(e.target.value ? Number(e.target.value) : null)}
              className="w-full rounded-xl border border-slate-200 px-4 py-3 font-semibold"
            >
              <option value="">Select flight</option>
              {flights.map((flight) => (
                <option key={flight.id} value={flight.id}>{flight.flightName ?? `${flight.source} -> ${flight.destination}`}</option>
              ))}
            </select>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input value={flightForm.flightName} onChange={(e) => setFlightForm((p) => ({ ...p, flightName: e.target.value }))} placeholder="Flight name" className="rounded-xl border border-slate-200 px-4 py-3 font-semibold" />
              <input value={flightForm.source} onChange={(e) => setFlightForm((p) => ({ ...p, source: e.target.value }))} placeholder="Source" className="rounded-xl border border-slate-200 px-4 py-3 font-semibold" />
              <input value={flightForm.destination} onChange={(e) => setFlightForm((p) => ({ ...p, destination: e.target.value }))} placeholder="Destination" className="rounded-xl border border-slate-200 px-4 py-3 font-semibold" />
              <input type="datetime-local" value={flightForm.departureTime} onChange={(e) => setFlightForm((p) => ({ ...p, departureTime: e.target.value }))} className="rounded-xl border border-slate-200 px-4 py-3 font-semibold" />
              <input type="datetime-local" value={flightForm.arrivalTime} onChange={(e) => setFlightForm((p) => ({ ...p, arrivalTime: e.target.value }))} className="rounded-xl border border-slate-200 px-4 py-3 font-semibold" />
              <input value={flightForm.imageUrl} onChange={(e) => setFlightForm((p) => ({ ...p, imageUrl: e.target.value }))} placeholder="Flight image URL" className="rounded-xl border border-slate-200 px-4 py-3 font-semibold" />
              <input type="number" value={flightForm.fare} onChange={(e) => setFlightForm((p) => ({ ...p, fare: e.target.value }))} placeholder="Fare" className="rounded-xl border border-slate-200 px-4 py-3 font-semibold" />
              <input value={flightForm.cabinClass} onChange={(e) => setFlightForm((p) => ({ ...p, cabinClass: e.target.value }))} placeholder="Cabin class" className="rounded-xl border border-slate-200 px-4 py-3 font-semibold" />
            </div>
            <button onClick={() => void handleUpdateFlight()} disabled={isSubmitting} className="bg-slate-900 text-white px-6 py-3 rounded-xl font-black inline-flex items-center gap-2 disabled:opacity-60">
              <span>{isSubmitting ? 'Updating...' : 'Update Flight'}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {activeTab === 'bookings' && (
          <div className="glass-card p-8">
            <h2 className="text-2xl font-black text-slate-900 mb-6">All Bookings</h2>
            <div className="space-y-4">
              {adminBookings.map((booking) => (
                <div key={booking.id} className="rounded-2xl border border-slate-100 bg-white p-4 flex justify-between gap-4">
                  <div>
                    <p className="text-xs font-black uppercase text-slate-400">{booking.type}</p>
                    <p className="font-black text-slate-900">Booking #{booking.id} • Item #{booking.itemId}</p>
                    <p className="text-sm text-slate-500 font-semibold">{booking.userEmail}</p>
                  </div>
                  <span className="text-xs font-black uppercase rounded-full px-3 py-2 bg-slate-100 text-slate-600 h-fit">{booking.status}</span>
                </div>
              ))}
              {adminBookings.length === 0 && <p className="text-slate-500 font-semibold">No bookings found.</p>}
            </div>
          </div>
        )}

        {activeTab === 'room-ratings' && (
          <div className="glass-card p-8">
            <h2 className="text-2xl font-black text-slate-900 mb-6">Room Ratings</h2>
            <div className="space-y-4">
              {roomRatings.map((rating) => (
                <div key={rating.id} className="rounded-2xl border border-slate-100 bg-white p-4">
                  <p className="text-xs font-black uppercase text-slate-400">Room #{rating.roomId} • {rating.rating}/5</p>
                  <p className="font-black text-slate-900">{rating.userEmail}</p>
                  <p className="text-sm text-slate-500 font-semibold">{rating.review || 'No review provided'}</p>
                </div>
              ))}
              {roomRatings.length === 0 && <p className="text-slate-500 font-semibold">No ratings found.</p>}
            </div>
          </div>
        )}

        {activeTab === 'room-payments' && (
          <div className="glass-card p-8">
            <h2 className="text-2xl font-black text-slate-900 mb-6">Room Payments</h2>
            <div className="space-y-4">
              {roomPayments.map((payment) => (
                <div key={payment.id} className="rounded-2xl border border-slate-100 bg-white p-4">
                  <p className="text-xs font-black uppercase text-slate-400">Booking #{payment.bookingId} • Room #{payment.roomId}</p>
                  <p className="font-black text-slate-900">{payment.userEmail}</p>
                  <p className="text-sm text-slate-500 font-semibold">{payment.travelerName} • Guests: {payment.guestCount}</p>
                  <p className="text-sm text-slate-500 font-semibold">{payment.paymentMethod} • Ref: {payment.paymentReference}</p>
                  <p className="text-sm text-slate-700 font-black">{payment.currency} {payment.totalAmount}</p>
                </div>
              ))}
              {roomPayments.length === 0 && <p className="text-slate-500 font-semibold">No room payments found.</p>}
            </div>
          </div>
        )}

        {activeTab === 'flight-payments' && (
          <div className="glass-card p-8">
            <h2 className="text-2xl font-black text-slate-900 mb-6">Flight Payments</h2>
            <div className="space-y-4">
              {flightPayments.map((payment) => (
                <div key={payment.id} className="rounded-2xl border border-slate-100 bg-white p-4">
                  <p className="text-xs font-black uppercase text-slate-400">Booking #{payment.bookingId} • Flight #{payment.flightId}</p>
                  <p className="font-black text-slate-900">{payment.userEmail}</p>
                  <p className="text-sm text-slate-500 font-semibold">{payment.travelerName} • Guests: {payment.guestCount}</p>
                  <p className="text-sm text-slate-500 font-semibold">{payment.paymentMethod} • Ref: {payment.paymentReference}</p>
                  <p className="text-sm text-slate-700 font-black">{payment.currency} {payment.totalAmount}</p>
                </div>
              ))}
              {flightPayments.length === 0 && <p className="text-slate-500 font-semibold">No flight payments found.</p>}
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="glass-card p-8">
            <h2 className="text-2xl font-black text-slate-900 mb-6">User Management</h2>
            <div className="space-y-4">
              {adminUsers.map((entry) => (
                <div key={entry.id} className="rounded-2xl border border-slate-100 bg-white p-4 flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs font-black uppercase text-slate-400">{entry.role}</p>
                    <h3 className="font-black text-slate-900">{entry.name}</h3>
                    <p className="text-sm font-semibold text-slate-500">{entry.email}</p>
                  </div>
                  <button
                    type="button"
                    disabled={entry.role === 'ADMIN' || deletingUserId === entry.id}
                    onClick={() => void handleDeleteUser(entry.id)}
                    className="inline-flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-xs font-black uppercase tracking-wider text-red-600 disabled:opacity-50"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span>{deletingUserId === entry.id ? 'Removing...' : 'Remove User'}</span>
                  </button>
                </div>
              ))}
              {adminUsers.length === 0 && <p className="text-slate-500 font-semibold">No users found.</p>}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminPanelPage;

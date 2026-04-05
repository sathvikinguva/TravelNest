import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BarChart3, PlusCircle, Bed, Plane, History, Users, 
  Settings, ChevronRight, Sparkles, LayoutGrid, Search, AlertCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { createAdminFlight, createAdminRoom, getAdminBookings } from '../api/client';
import { useToast } from '../hooks/useToast';
import type { ApiBooking } from '../api/types';

const AdminPanelPage = () => {
  const { user } = useAuth();
   const { showToast } = useToast();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
   const [roomForm, setRoomForm] = useState({
      name: '',
      location: '',
      price: '',
      available: true,
   });
   const [flightForm, setFlightForm] = useState({
      source: '',
      destination: '',
      date: '',
      price: '',
   });
   const [isPublishingRoom, setIsPublishingRoom] = useState(false);
   const [isPublishingFlight, setIsPublishingFlight] = useState(false);
   const [adminBookings, setAdminBookings] = useState<ApiBooking[]>([]);

   useEffect(() => {
      if (activeTab !== 'bookings' || user?.role !== 'ADMIN') {
         return;
      }

      const loadAdminBookings = async () => {
         try {
            const data = await getAdminBookings();
            setAdminBookings(data);
         } catch {
            showToast('Unable to load bookings. Ensure you are signed in as admin.', 'error');
         }
      };

      void loadAdminBookings();
   }, [activeTab, showToast, user?.role]);

   const handlePublishRoom = async () => {
      const price = Number(roomForm.price);
      if (!roomForm.name.trim() || !roomForm.location.trim() || Number.isNaN(price)) {
         showToast('Please fill valid room name, location, and price.', 'error');
         return;
      }

      setIsPublishingRoom(true);
      try {
         await createAdminRoom({
            name: roomForm.name.trim(),
            location: roomForm.location.trim(),
            price,
            available: roomForm.available,
         });
         showToast('Room published successfully.', 'success');
         setRoomForm({ name: '', location: '', price: '', available: true });
      } catch {
         showToast('Room publish failed. Re-login as admin and try again.', 'error');
      } finally {
         setIsPublishingRoom(false);
      }
   };

   const handlePublishFlight = async () => {
      const price = Number(flightForm.price);
      if (!flightForm.source.trim() || !flightForm.destination.trim() || !flightForm.date || Number.isNaN(price)) {
         showToast('Please fill valid source, destination, date, and price.', 'error');
         return;
      }

      setIsPublishingFlight(true);
      try {
         await createAdminFlight({
            source: flightForm.source.trim(),
            destination: flightForm.destination.trim(),
            date: new Date(flightForm.date).toISOString(),
            price,
         });
         showToast('Flight published successfully.', 'success');
         setFlightForm({ source: '', destination: '', date: '', price: '' });
      } catch {
         showToast('Flight publish failed. Re-login as admin and try again.', 'error');
      } finally {
         setIsPublishingFlight(false);
      }
   };

  if (user?.role !== 'ADMIN') {
    return (
      <div className="p-20 text-center flex flex-col items-center">
        <AlertCircle className="w-12 h-12 text-red-500 mb-6" />
        <h1 className="text-3xl font-black text-slate-900 mb-4">Unauthorized Access</h1>
        <p className="text-slate-500 font-medium mb-12">You must be an admin to view this page.</p>
        <button onClick={() => navigate('/')} className="px-8 py-4 bg-indigo-600 text-white rounded-2xl font-black">Return Home</button>
      </div>
    );
  }

  const sidebarLinks = [
    { id: 'dashboard', name: 'Dashboard', icon: BarChart3 },
    { id: 'add-room', name: 'Add Room', icon: PlusCircle, sub: Bed },
    { id: 'add-flight', name: 'Add Flight', icon: PlusCircle, sub: Plane },
    { id: 'bookings', name: 'View Bookings', icon: History },
    { id: 'users', name: 'User Management', icon: Users },
    { id: 'settings', name: 'System Settings', icon: Settings },
  ];

  return (
    <div className="flex min-h-screen bg-slate-50 gap-10 py-10">
      {/* Sidebar */}
      <motion.aside 
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="hidden lg:flex w-72 flex-col gap-2 shrink-0 glass-card p-6 border border-white max-h-[85vh] sticky top-32 overflow-y-auto"
      >
        <div className="flex items-center gap-4 mb-10 px-2 py-2">
           <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-100 ring-4 ring-indigo-50">
              <LayoutGrid className="w-6 h-6 text-white" />
           </div>
           <div>
              <h2 className="text-lg font-black text-slate-900 leading-tight">Admin Console</h2>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Ver. 4.0.2-LTS</p>
           </div>
        </div>

        <nav className="space-y-2">
          {sidebarLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => setActiveTab(link.id)}
              className={`w-full flex items-center justify-between p-4 rounded-2xl font-black text-sm transition-all group ${
                activeTab === link.id 
                  ? 'bg-slate-900 text-white shadow-xl shadow-slate-200' 
                  : 'text-slate-400 hover:bg-slate-100/50 hover:text-slate-600'
              }`}
            >
              <div className="flex items-center gap-3">
                <link.icon className={`w-5 h-5 ${activeTab === link.id ? 'text-indigo-400' : 'group-hover:text-indigo-500'}`} />
                <span>{link.name}</span>
              </div>
              {link.sub && (
                 <link.sub className={`w-3.5 h-3.5 ${activeTab === link.id ? 'opacity-80' : 'opacity-20'}`} />
              )}
            </button>
          ))}
        </nav>

        <div className="mt-auto p-6 bg-indigo-50 rounded-[2rem] border border-indigo-100 text-center relative overflow-hidden group">
           <Sparkles className="absolute -top-4 -right-4 w-20 h-20 text-indigo-200 opacity-50 rotate-12 transition-transform group-hover:scale-150" />
           <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-2 relative z-10">Pro Support</p>
           <p className="text-xs font-bold text-slate-500 leading-relaxed mb-4 relative z-10">Access 24/7 dedicated admin priority support anytime.</p>
           <button className="w-full bg-white text-indigo-600 py-2 rounded-xl text-xs font-black shadow-sm relative z-10 border border-indigo-100 hover:bg-indigo-600 hover:text-white transition-all">Enable Service</button>
        </div>
      </motion.aside>

      {/* Content Area */}
      <main className="flex-1 space-y-10 min-w-0 pr-4">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
           <div>
              <motion.h1 
                key={activeTab}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-4xl font-black text-slate-900 tracking-tight capitalize"
              >
                {activeTab.replace('-', ' ')}
              </motion.h1>
              <p className="text-slate-400 font-bold">Manage system resources and platform configuration.</p>
           </div>
           
           <div className="flex items-center gap-4">
              <div className="relative glass-card px-4 border-slate-200 shadow-sm flex items-center min-w-[300px]">
                 <Search className="w-4 h-4 text-slate-400 shrink-0" />
                 <input type="text" placeholder="Global search..." className="bg-transparent border-none py-3.5 px-3 text-sm font-bold text-slate-600 outline-none w-full" />
                 <kbd className="hidden md:inline px-2 py-0.5 rounded-lg bg-slate-100 border border-slate-200 text-[10px] font-black text-slate-400">⌘K</kbd>
              </div>
              <div className="relative w-12 h-12 glass-card flex items-center justify-center border-indigo-100 text-indigo-600 hover:bg-indigo-600 hover:text-white transition-all cursor-pointer group shadow-sm">
                 <div className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white group-hover:scale-125 transition-transform" />
                 <AlertCircle className="w-6 h-6" />
              </div>
           </div>
        </header>

        <AnimatePresence mode="wait">
           {activeTab === 'dashboard' ? (
              <motion.div 
                key="dash" 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-8"
              >
                 {[
                    { label: 'Active Users', value: '14,821', trend: '+12%', color: 'from-blue-500 to-indigo-600', sub: 'Last 30 days' },
                    { label: 'Total Revenue', value: '$84,290', trend: '+8.4%', color: 'from-emerald-500 to-teal-600', sub: 'Gross earnings' },
                    { label: 'Server Load', value: '24%', trend: '-4%', color: 'from-amber-500 to-orange-600', sub: 'CPU Utilization' }
                 ].map((stat, i) => (
                    <motion.div
                       key={i}
                       initial={{ opacity: 0, scale: 0.9 }}
                       animate={{ opacity: 1, scale: 1 }}
                       transition={{ delay: i * 0.1 }}
                       className="glass-card p-8 border-white/60 group hover:shadow-2xl transition-all"
                    >
                       <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">{stat.label}</p>
                       <div className="flex items-end justify-between mb-4">
                          <h3 className="text-4xl font-black text-slate-900 tracking-tight">{stat.value}</h3>
                          <span className={`text-[10px] font-black px-2 py-1 rounded-lg bg-indigo-50 text-indigo-600`}>{stat.trend}</span>
                       </div>
                       <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden mb-4">
                          <motion.div 
                             initial={{ width: 0 }} 
                             animate={{ width: i === 0 ? '70%' : i === 1 ? '45%' : '24%' }}
                             transition={{ duration: 1, delay: 0.5 }}
                             className={`h-full bg-gradient-to-r ${stat.color} rounded-full`} 
                          />
                       </div>
                       <p className="text-[10px] font-bold text-slate-300">{stat.sub}</p>
                    </motion.div>
                 ))}
              </motion.div>
           ) : activeTab === 'add-room' ? (
              <motion.div 
                 key="add-r"
                 initial={{ opacity: 0, x: 20 }}
                 animate={{ opacity: 1, x: 0 }}
                 className="glass-card max-w-4xl p-10 border-white/60 shadow-2xl space-y-10"
              >
                 <div className="flex items-center gap-6 pb-6 border-b border-slate-100">
                    <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-[1.5rem] text-indigo-600">
                       <Bed className="w-8 h-8" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-black text-slate-900 tracking-tight">Create Listing</h2>
                        <p className="text-slate-400 font-bold">Define details for a new luxury room or estate.</p>
                    </div>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
                    <div className="relative">
                       <input
                         type="text"
                         placeholder=" "
                         value={roomForm.name}
                         onChange={(e) => setRoomForm((prev) => ({ ...prev, name: e.target.value }))}
                         className="peer w-full bg-slate-50/70 border-2 border-slate-100 rounded-2xl pt-7 pb-3 px-6 font-bold text-slate-700 outline-none focus:bg-white focus:border-indigo-500 transition-all"
                       />
                       <label className="absolute left-6 top-4 text-[11px] font-black uppercase tracking-widest text-slate-400 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-sm peer-placeholder-shown:normal-case peer-placeholder-shown:tracking-normal transition-all">Property Name</label>
                    </div>
                    <div className="relative">
                       <input
                         type="text"
                         placeholder=" "
                         value={roomForm.location}
                         onChange={(e) => setRoomForm((prev) => ({ ...prev, location: e.target.value }))}
                         className="peer w-full bg-slate-50/70 border-2 border-slate-100 rounded-2xl pt-7 pb-3 px-6 font-bold text-slate-700 outline-none focus:bg-white focus:border-indigo-500 transition-all"
                       />
                       <label className="absolute left-6 top-4 text-[11px] font-black uppercase tracking-widest text-slate-400 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-sm peer-placeholder-shown:normal-case peer-placeholder-shown:tracking-normal transition-all">Location</label>
                    </div>
                    <div className="relative">
                       <input
                         type="number"
                         placeholder=" "
                         value={roomForm.price}
                         onChange={(e) => setRoomForm((prev) => ({ ...prev, price: e.target.value }))}
                         className="peer w-full bg-slate-50/70 border-2 border-slate-100 rounded-2xl pt-7 pb-3 px-6 font-bold text-slate-700 outline-none focus:bg-white focus:border-indigo-500 transition-all"
                       />
                       <label className="absolute left-6 top-4 text-[11px] font-black uppercase tracking-widest text-slate-400 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-sm peer-placeholder-shown:normal-case peer-placeholder-shown:tracking-normal transition-all">Base Rate ($)</label>
                    </div>
                    <div className="relative">
                       <select
                         value={roomForm.available ? 'available' : 'unavailable'}
                         onChange={(e) => setRoomForm((prev) => ({ ...prev, available: e.target.value === 'available' }))}
                         className="w-full bg-slate-50/70 border-2 border-slate-100 rounded-2xl pt-7 pb-3 px-6 font-bold text-slate-700 outline-none focus:bg-white focus:border-indigo-500 transition-all appearance-none cursor-pointer"
                       >
                          <option value="available">Available</option>
                          <option value="unavailable">Unavailable</option>
                       </select>
                       <label className="absolute left-6 top-4 text-[11px] font-black uppercase tracking-widest text-slate-400">Availability</label>
                    </div>
                    <div className="md:col-span-2 relative">
                        <textarea placeholder=" " rows={4} className="peer w-full bg-slate-50/70 border-2 border-slate-100 rounded-[2rem] pt-8 pb-4 px-8 font-bold text-slate-700 outline-none focus:bg-white focus:border-indigo-500 transition-all resize-none"></textarea>
                        <label className="absolute left-8 top-5 text-[11px] font-black uppercase tracking-widest text-slate-400 peer-placeholder-shown:top-8 peer-placeholder-shown:text-sm peer-placeholder-shown:normal-case peer-placeholder-shown:tracking-normal transition-all">Description</label>
                    </div>
                 </div>

                 <div className="flex items-center gap-4 pt-6">
                    <button
                       onClick={() => void handlePublishRoom()}
                       disabled={isPublishingRoom}
                       className="flex-1 bg-slate-900 text-white py-6 rounded-[2rem] font-black text-lg shadow-xl shadow-slate-200 transition-all hover:scale-[1.01] active:scale-95 flex items-center justify-center gap-3 disabled:opacity-60"
                    >
                       <span>{isPublishingRoom ? 'Publishing...' : 'Publish Listing'}</span>
                       <ChevronRight className="w-6 h-6" />
                    </button>
                    <button className="px-10 py-6 bg-slate-100 text-slate-500 rounded-[2rem] font-black transition-all hover:bg-slate-200">Draft</button>
                 </div>
              </motion.div>
                ) : activeTab === 'add-flight' ? (
                   <motion.div
                      key="add-f"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="glass-card max-w-4xl p-10 border-white/60 shadow-2xl space-y-10"
                   >
                      <div className="flex items-center gap-6 pb-6 border-b border-slate-100">
                         <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-[1.5rem] text-indigo-600">
                            <Plane className="w-8 h-8" />
                         </div>
                         <div>
                            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Create Flight</h2>
                            <p className="text-slate-400 font-bold">Add a new flight route and fare details.</p>
                         </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
                         <div className="relative">
                            <input
                              type="text"
                              placeholder=" "
                              value={flightForm.source}
                              onChange={(e) => setFlightForm((prev) => ({ ...prev, source: e.target.value }))}
                              className="peer w-full bg-slate-50/70 border-2 border-slate-100 rounded-2xl pt-7 pb-3 px-6 font-bold text-slate-700 outline-none focus:bg-white focus:border-indigo-500 transition-all"
                            />
                            <label className="absolute left-6 top-4 text-[11px] font-black uppercase tracking-widest text-slate-400 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-sm peer-placeholder-shown:normal-case peer-placeholder-shown:tracking-normal transition-all">Source</label>
                         </div>
                         <div className="relative">
                            <input
                              type="datetime-local"
                              placeholder=" "
                              value={flightForm.date}
                              onChange={(e) => setFlightForm((prev) => ({ ...prev, date: e.target.value }))}
                              className="peer w-full bg-slate-50/70 border-2 border-slate-100 rounded-2xl pt-7 pb-3 px-6 font-bold text-slate-700 outline-none focus:bg-white focus:border-indigo-500 transition-all"
                            />
                            <label className="absolute left-6 top-4 text-[11px] font-black uppercase tracking-widest text-slate-400">Travel Date</label>
                         </div>
                         <div className="relative">
                            <input
                              type="text"
                              placeholder=" "
                              value={flightForm.destination}
                              onChange={(e) => setFlightForm((prev) => ({ ...prev, destination: e.target.value }))}
                              className="peer w-full bg-slate-50/70 border-2 border-slate-100 rounded-2xl pt-7 pb-3 px-6 font-bold text-slate-700 outline-none focus:bg-white focus:border-indigo-500 transition-all"
                            />
                            <label className="absolute left-6 top-4 text-[11px] font-black uppercase tracking-widest text-slate-400 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-sm peer-placeholder-shown:normal-case peer-placeholder-shown:tracking-normal transition-all">Destination</label>
                         </div>
                         <div className="relative">
                            <input
                              type="number"
                              placeholder=" "
                              value={flightForm.price}
                              onChange={(e) => setFlightForm((prev) => ({ ...prev, price: e.target.value }))}
                              className="peer w-full bg-slate-50/70 border-2 border-slate-100 rounded-2xl pt-7 pb-3 px-6 font-bold text-slate-700 outline-none focus:bg-white focus:border-indigo-500 transition-all"
                            />
                            <label className="absolute left-6 top-4 text-[11px] font-black uppercase tracking-widest text-slate-400 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-sm peer-placeholder-shown:normal-case peer-placeholder-shown:tracking-normal transition-all">Fare ($)</label>
                         </div>
                         <div className="relative">
                            <select className="w-full bg-slate-50/70 border-2 border-slate-100 rounded-2xl pt-7 pb-3 px-6 font-bold text-slate-700 outline-none focus:bg-white focus:border-indigo-500 transition-all appearance-none cursor-pointer">
                               <option>Economy</option>
                               <option>Business</option>
                               <option>First</option>
                            </select>
                            <label className="absolute left-6 top-4 text-[11px] font-black uppercase tracking-widest text-slate-400">Cabin Class</label>
                         </div>
                      </div>

                      <div className="flex items-center gap-4 pt-6">
                         <button
                            onClick={() => void handlePublishFlight()}
                            disabled={isPublishingFlight}
                            className="flex-1 bg-indigo-600 text-white py-6 rounded-[2rem] font-black text-lg shadow-xl shadow-indigo-200 transition-all hover:scale-[1.01] active:scale-95 flex items-center justify-center gap-3 disabled:opacity-60"
                         >
                            <span>{isPublishingFlight ? 'Publishing...' : 'Publish Flight'}</span>
                            <ChevronRight className="w-6 h-6" />
                         </button>
                         <button className="px-10 py-6 bg-slate-100 text-slate-500 rounded-[2rem] font-black transition-all hover:bg-slate-200">Draft</button>
                      </div>
                   </motion.div>
                ) : activeTab === 'bookings' ? (
                   <motion.div
                      key="bookings"
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="glass-card p-8 border-white/60 shadow-2xl"
                   >
                      <h2 className="text-2xl font-black text-slate-900 mb-6">Recent Bookings</h2>
                      <div className="space-y-4">
                         {adminBookings.length === 0 ? (
                            <div className="rounded-2xl border border-dashed border-slate-200 p-8 text-slate-400 font-bold text-center">No booking data available yet.</div>
                         ) : (
                            adminBookings.map((booking) => (
                               <div key={booking.id} className="rounded-2xl border border-slate-100 bg-white/60 p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                                  <div>
                                     <p className="text-[10px] uppercase tracking-widest font-black text-slate-400 mb-1">{booking.type}</p>
                                     <h3 className="text-lg font-black text-slate-900">
                                        Item #{booking.itemId}
                                     </h3>
                                     <p className="text-sm font-semibold text-slate-500">Booking ID: {booking.id} • User: {booking.userEmail}</p>
                                  </div>
                                  <div className="text-right">
                                     <p className="text-sm font-bold text-slate-500">Status</p>
                                     <span className={`inline-flex px-3 py-1 rounded-full text-xs font-black border uppercase ${booking.status === 'BOOKED' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-slate-100 text-slate-500 border-slate-200'}`}>{booking.status}</span>
                                  </div>
                               </div>
                            ))
                         )}
                      </div>
                   </motion.div>
           ) : (
             <motion.div 
               key="other" 
               initial={{ opacity: 0 }} 
               animate={{ opacity: 1 }}
               className="glass-card p-20 text-center border-dashed border-slate-200"
             >
                <h3 className="text-2xl font-black text-slate-200">Section placeholder for: {activeTab}</h3>
             </motion.div>
           )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default AdminPanelPage;

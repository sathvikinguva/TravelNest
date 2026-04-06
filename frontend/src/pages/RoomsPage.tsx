import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Star, Heart, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Skeleton from '../components/Skeleton';
import Card from '../components/Card';
import { getRooms } from '../api/client';
import type { ApiRoom } from '../api/types';
import { useToast } from '../hooks/useToast';
import { getRoomImageById } from '../data/roomImages';

const ratingById = (id: number) => {
  const ratings = [4.9, 4.8, 4.7, 4.6];
  return ratings[id % ratings.length];
};

const RoomCard = ({ room, index }: { room: ApiRoom; index: number }) => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 30 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      whileHover={{ y: -10 }}
      className="overflow-hidden group border border-white/40 ring-1 ring-slate-100/50 flex flex-col h-full active:scale-[0.98] cursor-pointer"
      onClick={() => navigate(`/booking/${room.id}?type=room`)}
    >
      <Card className="h-full overflow-hidden !rounded-2xl">
        <div className="relative aspect-[4/3] overflow-hidden">
          <img
            src={room.imageUrl || getRoomImageById(room.id)}
            alt={room.name}
            onError={(event) => {
              event.currentTarget.src = `https://picsum.photos/seed/room-fallback-${room.id}/1200/800`;
            }}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-115"
          />
          <div className="absolute top-4 right-4 flex flex-col gap-2">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-2.5 bg-white/60 backdrop-blur-md rounded-2xl text-slate-900 border border-white/40 hover:bg-white transition-colors"
            >
              <Heart className="w-5 h-5 group-hover:fill-red-500 transition-colors" />
            </motion.button>
          </div>
          <div className="absolute bottom-4 left-4 bg-slate-900/40 backdrop-blur-md text-white px-3 py-1.5 rounded-xl flex items-center gap-1.5 text-xs font-bold border border-white/10">
            <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
            <span>{ratingById(room.id)}</span>
          </div>
        </div>

        <div className="p-6 flex flex-col flex-1">
          <div className="flex items-start justify-between gap-4 mb-3">
            <h3 className="text-xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors leading-tight">{room.name}</h3>
            <div className="flex flex-col items-end">
              <span className="text-2xl font-black text-indigo-600">${room.price}</span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">per night</span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-slate-500 mb-4 font-semibold text-sm">
            <MapPin className="w-4 h-4 text-slate-400" />
            <span>{room.location}</span>
            <span className="text-slate-300">•</span>
            <span>{room.roomType || 'Standard'}</span>
          </div>

          <p className="text-slate-400 text-sm line-clamp-2 mb-6 font-medium leading-relaxed">
            {room.description?.trim() || (room.available
              ? 'Available now for instant booking.'
              : 'Temporarily unavailable. Check again soon.')}
          </p>

          <div className="mt-auto flex items-center justify-between">
            <motion.button whileHover={{ gap: '12px' }} className="flex items-center gap-2 text-indigo-600 font-bold group-hover:gap-3 transition-all">
              <span>Details</span>
              <ArrowRight className="w-5 h-5" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-slate-900 text-white px-5 py-2.5 rounded-2xl text-sm font-bold shadow-lg shadow-slate-200"
            >
              Book Now
            </motion.button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

const RoomsPage = () => {
  const [loading, setLoading] = useState(true);
  const [rooms, setRooms] = useState<ApiRoom[]>([]);
  const { showToast } = useToast();

  useEffect(() => {
    const loadRooms = async () => {
      setLoading(true);
      try {
        const data = await getRooms();
        setRooms(data);
      } catch {
        showToast('Unable to load rooms from backend.', 'error');
      } finally {
        setLoading(false);
      }
    };

    void loadRooms();
  }, [showToast]);

  return (
    <div className="py-12">
      <div className="mb-12">
        <motion.h2 className="text-4xl font-extrabold text-slate-900 tracking-tight" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          Curated Stays
        </motion.h2>
        <motion.p className="text-slate-500 font-medium" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
          Discover unique spaces that feel like home, only better.
        </motion.p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mb-20 px-1">
          {Array.from({ length: 4 }).map((_, idx) => (
            <div key={idx} className="glass-card p-4 rounded-2xl">
              <Skeleton className="h-48 mb-4" />
              <Skeleton className="h-6 mb-3" />
              <Skeleton className="h-4 mb-2" />
              <Skeleton className="h-10 mt-6" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mb-20 px-1">
          {rooms.map((room, index) => (
            <RoomCard key={room.id} room={room} index={index} />
          ))}
        </div>
      )}
    </div>
  );
};

export default RoomsPage;

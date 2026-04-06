import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Bed, Plane, User, LogOut, LayoutDashboard, Briefcase, Menu, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = React.useState(false);

  const navLinks = [
    { name: 'Rooms', path: '/rooms', icon: Bed },
    { name: 'Flights', path: '/flights', icon: Plane },
    { name: 'My Bookings', path: '/my-bookings', icon: Briefcase },
  ];

  if (user?.role === 'ADMIN') {
    navLinks.push({ name: 'Admin', path: '/admin', icon: LayoutDashboard });
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-4 py-4 pointer-events-none">
      <div className="max-w-7xl mx-auto flex items-center justify-between glass-card backdrop-blur-xl border border-white/20 px-6 py-3 pointer-events-auto">
        <NavLink to="/" className="flex items-center gap-2 group">
          <motion.div
            whileHover={{ rotate: 15 }}
            className="p-2 bg-indigo-600 rounded-xl shadow-lg ring-4 ring-indigo-500/10"
          >
            <Briefcase className="w-6 h-6 text-white" />
          </motion.div>
          <span className="font-bold text-2xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
            TravelNest
          </span>
        </NavLink>

        <div className="hidden md:flex items-center gap-2">
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) => cn(
                "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300",
                isActive 
                  ? "bg-indigo-600 text-white shadow-xl shadow-indigo-200" 
                  : "text-slate-600 hover:bg-slate-100/50 hover:text-indigo-600"
              )}
            >
              <link.icon className="w-4 h-4" />
              {link.name}
            </NavLink>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-3">
              <div className="flex flex-col items-end mr-1">
                <span className="text-xs font-bold text-slate-800 leading-tight">{user.name}</span>
                <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">{user.role}</span>
              </div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 border-2 border-white shadow-md flex items-center justify-center text-white"
              >
                <User className="w-5 h-5" />
              </motion.div>
              <button
                onClick={() => { logout(); navigate('/login'); }}
                className="p-2.5 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-50 hover:shadow-lg transition-all duration-300 ring-1 ring-slate-100"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <NavLink
              to="/login"
              className="bg-slate-900 text-white px-6 py-2.5 rounded-xl font-bold shadow-xl hover:bg-slate-800 transition-all duration-300 active:scale-95"
            >
              Sign In
            </NavLink>
          )}
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-24 left-4 right-4 bg-white/90 backdrop-blur-2xl rounded-3xl p-6 shadow-2xl border border-white/40 md:hidden pointer-events-auto"
          >
            <div className="flex flex-col gap-3">
              {navLinks.map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-4 p-4 rounded-2xl text-slate-600 font-semibold hover:bg-indigo-50 hover:text-indigo-600 transition-all"
                >
                  <link.icon className="w-5 h-5" />
                  {link.name}
                </NavLink>
              ))}
              <hr className="my-2 border-slate-100" />
              {user ? (
                <button
                  onClick={() => { logout(); setIsOpen(false); navigate('/login'); }}
                  className="flex items-center gap-4 p-4 rounded-2xl text-red-500 font-semibold hover:bg-red-50 transition-all"
                >
                  <LogOut className="w-5 h-5" />
                  Sign Out
                </button>
              ) : (
                <NavLink
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-center p-4 rounded-2xl bg-indigo-600 text-white font-bold shadow-lg"
                >
                  Sign In
                </NavLink>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;

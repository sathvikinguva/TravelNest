import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { motion } from 'framer-motion';

const MainLayout = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col pt-24 selection:bg-indigo-100 selection:text-indigo-600">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 pb-20 overflow-x-hidden">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="w-full relative h-full flex flex-col"
        >
          <Outlet />
        </motion.div>
      </main>

      {/* Background decoration */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none -z-10 overflow-hidden">
        <div className="absolute -top-1/4 -right-1/4 w-[60%] h-[60%] rounded-full bg-indigo-50/50 blur-[100px]" />
        <div className="absolute -bottom-1/4 -left-1/4 w-[60%] h-[60%] rounded-full bg-purple-50/50 blur-[100px]" />
      </div>
    </div>
  );
};

export default MainLayout;

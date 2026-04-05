import { useState } from 'react';
import { motion } from 'framer-motion';
import { LogIn, UserCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../hooks/useToast';

const LoginPage = () => {
  const { loginWithGoogle } = useAuth();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    setLoading(true);
    showToast('Redirecting to Google sign in...', 'info');
    loginWithGoogle();
  };

  return (
    <div className="min-h-screen bg-[url('https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')] bg-cover bg-center flex items-center justify-center p-6 sm:p-12 relative overflow-hidden">
      {/* Background Overlay */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />

      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-md glass backdrop-blur-xl border border-white/20 p-8 sm:p-10 rounded-3xl shadow-2xl relative z-10"
      >
        <div className="flex flex-col items-center mb-10 text-center">
          <div className="p-4 bg-indigo-500 rounded-full mb-6 ring-4 ring-indigo-500/20">
            <LogIn className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2 drop-shadow-sm">Welcome Back</h1>
          <p className="text-slate-200">Sign in to start your adventure</p>
        </div>

        <div className="space-y-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleLogin}
            disabled={loading}
            className="w-full flex items-center justify-center gap-4 bg-white text-slate-800 p-4 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden group border border-transparent hover:border-indigo-500/50"
          >
            <div className="absolute inset-x-0 bottom-0 h-1 bg-indigo-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
            {loading ? (
              <div className="h-5 w-5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <UserCircle className="w-6 h-6 text-slate-600" />
                <span>Continue with Google</span>
              </>
            )}
          </motion.button>
        </div>

        <div className="mt-12 text-center text-slate-300 text-sm">
          Privacy Policy • Terms of Service
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;

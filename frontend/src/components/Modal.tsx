import { AnimatePresence, motion } from 'framer-motion';
import type { ReactNode } from 'react';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

const Modal = ({ open, onClose, title, children }: ModalProps) => {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[90] bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-100 p-6"
            onClick={(event) => event.stopPropagation()}
          >
            <h3 className="text-2xl font-black text-slate-900 mb-3">{title}</h3>
            <div className="text-slate-500 font-medium">{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Modal;

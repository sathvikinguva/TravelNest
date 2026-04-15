import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { cancelMyBooking, createBooking, getMyBookings } from '../api/client';
import type { ApiBooking, BookingType } from '../api/types';
import { useAuth } from './AuthContext';

interface CreateBookingPayload {
  type: BookingType;
  itemId: number;
  travelerName: string;
  travelerNotes: string;
  travelDate: string;
  guestCount: number;
  paymentMethod: string;
  paymentReference: string;
  cardLast4: string;
  upiId: string;
  baseAmount: string;
  taxAmount: string;
  totalAmount: string;
  currency: string;
}

interface BookingContextType {
  bookings: ApiBooking[];
  loading: boolean;
  refreshMyBookings: () => Promise<void>;
  createNewBooking: (payload: CreateBookingPayload) => Promise<ApiBooking>;
  cancelBooking: (bookingId: number) => Promise<ApiBooking>;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export const BookingProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [bookings, setBookings] = useState<ApiBooking[]>([]);
  const [loading, setLoading] = useState(false);
  const { token } = useAuth();

  const refreshMyBookings = useCallback(async () => {
    if (!token) {
      setBookings([]);
      return;
    }

    setLoading(true);
    try {
      const data = await getMyBookings();
      setBookings(data);
    } finally {
      setLoading(false);
    }
  }, [token]);

  const createNewBooking = useCallback(async (payload: CreateBookingPayload) => {
    const created = await createBooking(payload);
    setBookings((prev) => [created, ...prev]);
    return created;
  }, []);

  const cancelBooking = useCallback(async (bookingId: number) => {
    const updated = await cancelMyBooking(bookingId);
    setBookings((prev) => prev.map((booking) => (booking.id === bookingId ? updated : booking)));
    return updated;
  }, []);

  useEffect(() => {
    void refreshMyBookings();
  }, [refreshMyBookings]);

  const value = useMemo(
    () => ({ bookings, loading, refreshMyBookings, createNewBooking, cancelBooking }),
    [bookings, loading, refreshMyBookings, createNewBooking, cancelBooking]
  );

  return <BookingContext.Provider value={value}>{children}</BookingContext.Provider>;
};

export const useBooking = () => {
  const context = useContext(BookingContext);
  if (!context) throw new Error('useBooking must be used within a BookingProvider');
  return context;
};

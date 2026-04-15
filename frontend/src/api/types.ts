export type Role = 'USER' | 'ADMIN';

export interface AuthUser {
  userId: number;
  email: string;
  role: Role;
  name: string;
}

export interface ApiRoom {
  id: number;
  name: string;
  location: string;
  imageUrl: string;
  roomType: string;
  description: string;
  price: number;
  available: boolean;
}

export interface ApiFlight {
  id: number;
  flightName: string;
  source: string;
  destination: string;
  date: string;
  departureTime: string;
  arrivalTime: string;
  imageUrl: string;
  cabinClass: string;
  price: number;
}

export interface ApiRoomRatingSummary {
  roomId: number;
  averageRating: number;
  ratingCount: number;
}

export interface ApiRoomRating {
  id: number;
  roomId: number;
  userId: number;
  userEmail: string;
  rating: number;
  review: string | null;
  createdAt: string;
}

export interface ApiRoomPayment {
  id: number;
  bookingId: number;
  userId: number;
  userEmail: string;
  roomId: number;
  travelerName: string;
  guestCount: number;
  paymentMethod: string;
  paymentReference: string;
  totalAmount: string;
  currency: string;
  paidAt: string;
}

export interface ApiFlightPayment {
  id: number;
  bookingId: number;
  userId: number;
  userEmail: string;
  flightId: number;
  travelerName: string;
  guestCount: number;
  paymentMethod: string;
  paymentReference: string;
  totalAmount: string;
  currency: string;
  paidAt: string;
}

export type BookingType = 'ROOM' | 'FLIGHT';
export type BookingStatus = 'BOOKED' | 'CANCELLED';

export interface ApiBooking {
  id: number;
  userId: number;
  userEmail: string;
  type: BookingType;
  itemId: number;
  status: BookingStatus;
  travelerName: string;
  travelerNotes: string | null;
  travelDate: string;
  guestCount: number;
  paymentMethod: string;
  paymentReference: string;
  cardLast4: string | null;
  upiId: string | null;
  baseAmount: string;
  taxAmount: string;
  totalAmount: string;
  currency: string;
}

export interface ApiAdminUser {
  id: number;
  name: string;
  email: string;
  role: Role;
}

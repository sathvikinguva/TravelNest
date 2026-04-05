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
  price: number;
  available: boolean;
}

export interface ApiFlight {
  id: number;
  source: string;
  destination: string;
  date: string;
  price: number;
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
}

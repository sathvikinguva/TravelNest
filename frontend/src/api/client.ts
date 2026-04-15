import type {
  ApiAdminUser,
  ApiBooking,
  ApiFlight,
  ApiFlightPayment,
  ApiRoom,
  ApiRoomPayment,
  ApiRoomRating,
  ApiRoomRatingSummary,
  BookingType,
} from './types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'https://travelnest-kc5e.onrender.com';
const TOKEN_STORAGE_KEY = 'travel.jwt';

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

const isObject = (value: unknown): value is Record<string, unknown> => {
  return typeof value === 'object' && value !== null;
};

const readErrorMessage = (payload: unknown): string | null => {
  if (isObject(payload) && typeof payload.message === 'string') {
    return payload.message;
  }
  return null;
};

const request = async <T>(path: string, options: RequestInit = {}): Promise<T> => {
  const token = getAuthToken();
  const headers = new Headers(options.headers ?? {});

  if (!headers.has('Content-Type') && options.body) {
    headers.set('Content-Type', 'application/json');
  }
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
    credentials: 'include',
  });

  if (!response.ok) {
    let payload: unknown = null;
    try {
      payload = await response.json();
    } catch {
      payload = null;
    }
    const fallbackMessage = response.status === 401 ? 'Please sign in to continue.' : 'Request failed.';
    throw new ApiError(readErrorMessage(payload) ?? fallbackMessage, response.status);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
};

export const getGoogleOAuthLoginUrl = () => `${API_BASE_URL}/oauth2/authorization/google`;

export const setAuthToken = (token: string) => {
  localStorage.setItem(TOKEN_STORAGE_KEY, token);
};

export const getAuthToken = () => localStorage.getItem(TOKEN_STORAGE_KEY);

export const clearAuthToken = () => {
  localStorage.removeItem(TOKEN_STORAGE_KEY);
};

export const getRooms = () => request<ApiRoom[]>('/api/rooms');
export const getRoomById = (id: number) => request<ApiRoom>(`/api/rooms/${id}`);
export const getRoomRatingsSummary = () => request<ApiRoomRatingSummary[]>('/api/rooms/ratings');
export const addRoomRating = (id: number, payload: { rating: number; review: string }) =>
  request<ApiRoomRating>(`/api/rooms/${id}/ratings`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });

export const getFlights = () => request<ApiFlight[]>('/api/flights');
export const getFlightById = (id: number) => request<ApiFlight>(`/api/flights/${id}`);

export const createAdminRoom = (payload: {
  name: string;
  location: string;
  imageUrl: string;
  roomType: string;
  description: string;
  price: number;
  available: boolean;
}) =>
  request<ApiRoom>('/api/admin/rooms', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

export const createAdminFlight = (payload: {
  flightName: string;
  source: string;
  destination: string;
  departureTime: string;
  arrivalTime: string;
  imageUrl: string;
  cabinClass: string;
  price: number;
}) =>
  request<ApiFlight>('/api/admin/flights', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

export const updateAdminRoom = (
  id: number,
  payload: {
    name: string;
    location: string;
    imageUrl: string;
    roomType: string;
    description: string;
    price: number;
    available: boolean;
  }
) =>
  request<ApiRoom>(`/api/admin/rooms/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });

export const updateAdminFlight = (
  id: number,
  payload: {
    flightName: string;
    source: string;
    destination: string;
    departureTime: string;
    arrivalTime: string;
    imageUrl: string;
    cabinClass: string;
    price: number;
  }
) =>
  request<ApiFlight>(`/api/admin/flights/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });

export const getAdminBookings = () => request<ApiBooking[]>('/api/admin/bookings');
export const getAdminRoomRatings = () => request<ApiRoomRating[]>('/api/admin/room-ratings');
export const getAdminRoomPayments = () => request<ApiRoomPayment[]>('/api/admin/payments/rooms');
export const getAdminFlightPayments = () => request<ApiFlightPayment[]>('/api/admin/payments/flights');

export const createBooking = (payload: {
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
}) =>
  request<ApiBooking>('/api/bookings', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

export const getMyBookings = () => request<ApiBooking[]>('/api/bookings/my');

export const cancelMyBooking = (bookingId: number) =>
  request<ApiBooking>(`/api/bookings/${bookingId}/cancel`, {
    method: 'PUT',
  });

export const getAdminUsers = () => request<ApiAdminUser[]>('/api/admin/users');

export const deleteAdminUser = (userId: number) =>
  request<void>(`/api/admin/users/${userId}`, {
    method: 'DELETE',
  });

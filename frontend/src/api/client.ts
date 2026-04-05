import type { ApiBooking, ApiFlight, ApiRoom, BookingType } from './types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080';
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

export const getFlights = () => request<ApiFlight[]>('/api/flights');
export const getFlightById = (id: number) => request<ApiFlight>(`/api/flights/${id}`);

export const createAdminRoom = (payload: {
  name: string;
  location: string;
  price: number;
  available: boolean;
}) =>
  request<ApiRoom>('/api/admin/rooms', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

export const createAdminFlight = (payload: {
  source: string;
  destination: string;
  date: string;
  price: number;
}) =>
  request<ApiFlight>('/api/admin/flights', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

export const getAdminBookings = () => request<ApiBooking[]>('/api/admin/bookings');

export const createBooking = (payload: { type: BookingType; itemId: number }) =>
  request<ApiBooking>('/api/bookings', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

export const getMyBookings = () => request<ApiBooking[]>('/api/bookings/my');

export const cancelMyBooking = (bookingId: number) =>
  request<ApiBooking>(`/api/bookings/${bookingId}/cancel`, {
    method: 'PUT',
  });

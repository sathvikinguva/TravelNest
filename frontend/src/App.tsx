import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { BookingProvider } from './context/BookingContext';
import MainLayout from './layouts/MainLayout';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RoomsPage from './pages/RoomsPage';
import FlightsPage from './pages/FlightsPage';
import BookingPage from './pages/BookingPage';
import PaymentPage from './pages/PaymentPage';
import SuccessPage from './pages/SuccessPage';
import MyBookingsPage from './pages/MyBookingsPage';
import AdminPanelPage from './pages/AdminPanelPage';
import OAuthCallbackPage from './pages/OAuthCallbackPage';
import { ToastProvider } from './context/ToastContext';

const ProtectedRoute = ({ children, adminOnly = false }: { children: React.ReactNode; adminOnly?: boolean }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  if (adminOnly && user.role !== 'ADMIN') return <Navigate to="/" />;
  return <>{children}</>;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <ToastProvider>
          <BookingProvider>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/oauth/callback" element={<OAuthCallbackPage />} />
              <Route path="/" element={<MainLayout />}>
                <Route index element={<HomePage />} />
                <Route path="rooms" element={<RoomsPage />} />
                <Route path="flights" element={<FlightsPage />} />
                <Route path="booking/:id" element={<BookingPage />} />
                <Route path="payment" element={<ProtectedRoute><PaymentPage /></ProtectedRoute>} />
                <Route path="success" element={<ProtectedRoute><SuccessPage /></ProtectedRoute>} />
                <Route path="my-bookings" element={<ProtectedRoute><MyBookingsPage /></ProtectedRoute>} />
                <Route path="admin" element={<ProtectedRoute adminOnly><AdminPanelPage /></ProtectedRoute>} />
              </Route>
            </Routes>
          </BookingProvider>
        </ToastProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;


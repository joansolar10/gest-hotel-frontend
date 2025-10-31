import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { LoginPage } from './pages/LoginPage';
import { RoomsPage } from './pages/RoomsPage';
import { RoomDetailPage } from './pages/RoomDetailPage';
import { NewReservationPage } from './pages/NewReservationPage';
import { ReservationDetailPage } from './pages/ReservationDetailPage';
import { PaymentPage } from './pages/PaymentPage';
import { ConfirmationPage } from './pages/ConfirmationPage';
import { DNIVerificationPage } from './pages/DNIVerificationPage';
import { Navbar } from './components/Navbar';

function App() {
  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <AuthProvider>
        <BrowserRouter>
          <Navbar />
          <Routes>
            {/* Rutas públicas */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/" element={<RoomsPage />} />
            <Route path="/rooms" element={<RoomsPage />} />
            <Route path="/verify-dni" element={<DNIVerificationPage />} />
            
            {/* Rutas protegidas - requieren verificación DNI */}
            <Route 
              path="/rooms/:id" 
              element={
                <ProtectedRoute>
                  <RoomDetailPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/reservations/new" 
              element={
                <ProtectedRoute>
                  <NewReservationPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/reservations/:id" 
              element={
                <ProtectedRoute>
                  <ReservationDetailPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/payments/:id" 
              element={
                <ProtectedRoute>
                  <PaymentPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/reservations/:id/confirmation" 
              element={
                <ProtectedRoute>
                  <ConfirmationPage />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </BrowserRouter>
        <Toaster position="top-right" />
      </AuthProvider>
    </GoogleOAuthProvider>
  );
}

export default App;
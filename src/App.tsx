import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import { AuthProvider } from './context/AuthContext';

import { ProtectedRoute } from './components/ProtectedRoute';

import { DNIProtectedRoute } from './components/DNIProtectedRoute';

import { Navbar } from './components/Navbar';

 

// Pages

import { LoginPage } from './pages/LoginPage';

import { RoomsPage } from './pages/RoomsPage';

import { MyReservationsPage } from './pages/MyReservationsPage';

import { RoomDetailPage } from './pages/RoomDetailPage';

import { NewReservationPage } from './pages/NewReservationPage';

import { PaymentPage } from './pages/PaymentPage';

import { ConfirmationPage } from './pages/ConfirmationPage';

import { DNIVerificationPage } from './pages/DNIVerificationPage';

import { ContactPage } from './pages/ContactPage';

import { AboutPage } from './pages/AboutPage';

import { ProfilePage } from './pages/ProfilePage';

import { AdminDashboardPage } from './pages/AdminDashboardPage';

import { AdminReservationsPage } from './pages/AdminReservationsPage';

import { AdminRoomsPage } from './pages/AdminRoomsPage';

 

const AppContent = () => {

  return (

    <>

      <Navbar />

 

      <div style={{

        minHeight: 'calc(100vh - 80px)'
      }}>
        <Routes>
          {/* RUTAS PÚBLICAS */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/verify-dni" element={<DNIVerificationPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/about" element={<AboutPage />} />

          {/* RUTAS PROTEGIDAS - SOLO LOGIN */}
          <Route path="/rooms" element={<ProtectedRoute><RoomsPage /></ProtectedRoute>} />
          <Route path="/rooms/:id" element={<ProtectedRoute><RoomDetailPage /></ProtectedRoute>} />
          <Route path="/my-reservations" element={<ProtectedRoute><MyReservationsPage /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
          <Route path="/confirmation/:id" element={<ProtectedRoute><ConfirmationPage /></ProtectedRoute>} />

          {/* RUTAS PROTEGIDAS - LOGIN + DNI */}
          <Route path="/rooms/:id/reserve" element={<DNIProtectedRoute><NewReservationPage /></DNIProtectedRoute>} />
          <Route path="/payment/:id" element={<DNIProtectedRoute><PaymentPage /></DNIProtectedRoute>} />

          {/* RUTAS ADMIN */}
          <Route path="/admin" element={<ProtectedRoute><AdminDashboardPage /></ProtectedRoute>} />
          <Route path="/admin/reservations" element={<ProtectedRoute><AdminReservationsPage /></ProtectedRoute>} />
          <Route path="/admin/rooms" element={<ProtectedRoute><AdminRoomsPage /></ProtectedRoute>} />

          {/* RUTAS DEFAULT */}
          <Route path="/" element={<Navigate to="/rooms" replace />} />
          <Route path="*" element={<Navigate to="/rooms" replace />} />
        </Routes>
      </div>
    </>
  );
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
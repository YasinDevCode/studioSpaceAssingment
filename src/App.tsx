import type { ReactNode } from 'react';
import { BrowserRouter, Outlet, Route, Routes } from 'react-router-dom';
import { Toaster } from 'sonner';
import { Footer } from './components/Footer';
import { Navbar } from './components/Navbar';
import { PrivateRoute } from './components/PrivateRoute';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { WishlistProvider } from './context/WishlistContext';
import { AboutPage } from './pages/AboutPage';
import { AddStudioPage } from './pages/AddStudioPage';
import { DashboardPage } from './pages/DashboardPage';
import { EditStudioPage } from './pages/EditStudioPage';
import { ExploreStudiosPage } from './pages/ExploreStudiosPage';
import { HomePage } from './pages/HomePage';
import { HowItWorksPage } from './pages/HowItWorksPage';
import { LoginPage } from './pages/LoginPage';
import { MyBookingsPage } from './pages/MyBookingsPage';
import { MyListingsPage } from './pages/MyListingsPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { RegisterPage } from './pages/RegisterPage';
import { StudioDetailsPage } from './pages/StudioDetailsPage';

function SiteLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

function ProtectedPage({ children }: { children: ReactNode }) {
  return <PrivateRoute>{children}</PrivateRoute>;
}

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <WishlistProvider>
            <Toaster position="top-right" richColors />
            <Routes>
              <Route element={<SiteLayout />}>
                <Route index element={<HomePage />} />
                <Route path="studios" element={<ExploreStudiosPage />} />
                <Route path="studios/edit/:id" element={<ProtectedPage><EditStudioPage /></ProtectedPage>} />
                <Route path="studios/:id" element={<StudioDetailsPage />} />
                <Route path="how-it-works" element={<HowItWorksPage />} />
                <Route path="about" element={<AboutPage />} />
                <Route path="login" element={<LoginPage />} />
                <Route path="register" element={<RegisterPage />} />
                <Route path="dashboard" element={<ProtectedPage><DashboardPage /></ProtectedPage>} />
                <Route path="my-bookings" element={<ProtectedPage><MyBookingsPage /></ProtectedPage>} />
                <Route path="my-listings" element={<ProtectedPage><MyListingsPage /></ProtectedPage>} />
                <Route path="add-studio" element={<ProtectedPage><AddStudioPage /></ProtectedPage>} />
                <Route path="*" element={<NotFoundPage />} />
              </Route>
            </Routes>
          </WishlistProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import AllDoctorsPage from './pages/AllDoctorsPage';
import CentersOfExcellencePage from './pages/CentersOfExcellencePage';
import AllServicesPage from './pages/AllServicesPage';
import AboutUsPage from './pages/AboutUsPage';
import ContactUsPage from './pages/ContactUsPage';
import DoctorDetailsPage from './pages/DoctorDetailsPage';
import DepartmentDetailsPage from './pages/DepartmentDetailsPage';
import ServiceDetailsPage from './pages/ServiceDetailsPage';
import HealthCarePackagesPage from './pages/HealthCarePackagesPage';
import PackageDetailsPage from './pages/PackageDetailsPage';
import BookHealthCheckupPage from './pages/BookHealthCheckupPage';
import DiagnosticsPage from './pages/DiagnosticsPage';
import AdminPage from './pages/AdminPage';
import BookingPage from './pages/BookingPage';
import ScrollToTop from './components/ScrollToTop';
import StickyBottomBar from './components/StickyBottomBar';
import FloatingCallButton from './components/FloatingCallButton';
import './App.css';

function AppContent() {
  const location = useLocation();
  const isAdminPage = location.pathname.toLowerCase().startsWith('/admin');


  return (
    <div className="min-h-screen bg-hospital-bg flex flex-col">
      {!isAdminPage && <Navbar />}
      <main className={`grow ${!isAdminPage ? 'pb-20 lg:pb-0' : ''}`}>
        <Routes>
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/" element={<HomePage />} />
          <Route path="/book" element={<BookingPage />} />
          <Route path="/doctors" element={<AllDoctorsPage />} />
          <Route path="/doctors/:slug" element={<DoctorDetailsPage />} />
          <Route path="/departments" element={<CentersOfExcellencePage />} />
          <Route path="/departments/:slug" element={<DepartmentDetailsPage />} />
          <Route path="/services" element={<AllServicesPage />} />
          <Route path="/services/health-check-packages" element={<HealthCarePackagesPage />} />
          <Route path="/services/health-check-packages/:packageSlug" element={<PackageDetailsPage />} />
          <Route path="/services/health-check-packages/:packageSlug/book" element={<BookHealthCheckupPage />} />
          <Route path="/services/diagnostics" element={<DiagnosticsPage />} />
          <Route path="/services/:slug" element={<ServiceDetailsPage />} />
          <Route path="/about" element={<AboutUsPage />} />
          <Route path="/contact" element={<ContactUsPage />} />
        </Routes>
      </main>
      {!isAdminPage && <Footer />}
      {!isAdminPage && <StickyBottomBar />}
      {/* {!isAdminPage && <FloatingCallButton />} */}
    </div>
  );
}

function App() {
  return (
    <Router>
      <ScrollToTop />
      <AppContent />
    </Router>
  );
}

export default App;


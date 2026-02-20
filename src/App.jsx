import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import AllDoctorsPage from './pages/AllDoctorsPage';
import CentersOfExcellencePage from './pages/CentersOfExcellencePage';
import AboutUsPage from './pages/AboutUsPage';
import ContactUsPage from './pages/ContactUsPage';
import DoctorDetailsPage from './pages/DoctorDetailsPage';
import DepartmentDetailsPage from './pages/DepartmentDetailsPage';
import StickyBottomBar from './components/StickyBottomBar';
import FloatingCallButton from './components/FloatingCallButton';
import './App.css';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-hospital-bg flex flex-col">
        <Navbar />
        <main className="grow pb-20 lg:pb-0">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/doctors" element={<AllDoctorsPage />} />
            <Route path="/doctors/:slug" element={<DoctorDetailsPage />} />
            <Route path="/departments" element={<CentersOfExcellencePage />} />
            <Route path="/departments/:slug" element={<DepartmentDetailsPage />} />
            <Route path="/about" element={<AboutUsPage />} />
            <Route path="/contact" element={<ContactUsPage />} />
          </Routes>
        </main>
        <Footer />
        <StickyBottomBar />
        {/* <FloatingCallButton /> */}
      </div>
    </Router>
  );
}

export default App;

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
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
            <Route path="/doctors/:slug" element={<DoctorDetailsPage />} />
            <Route path="/departments/:slug" element={<DepartmentDetailsPage />} />
          </Routes>
        </main>
        <Footer />
        <StickyBottomBar />
        <FloatingCallButton />
      </div>
    </Router>
  );
}

export default App;

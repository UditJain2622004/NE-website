import HeroSection from '../components/home/HeroSection';
import FounderIntroSection from '../components/home/FounderIntroSection';
import DepartmentsSection from '../components/home/DepartmentsSection';
import FeaturedDoctorsSection from '../components/home/FeaturedDoctorsSection';
import ServicesSection from '../components/home/ServicesSection';
import AppointmentSection from '../components/home/AppointmentSection';
import WhyChooseUsSection from '../components/home/WhyChooseUsSection';
import TestimonialsSection from '../components/home/TestimonialsSection';
import FAQSection from '../components/home/FAQSection';

// Note: StatsSection and QuickAccessSection have been integrated into HeroSection/QuickActionBar as per modern redesign.

const HomePage = () => {
  return (
    <div className="flex flex-col">
      <HeroSection />
      <FounderIntroSection />
      <DepartmentsSection />
      <FeaturedDoctorsSection />
      <ServicesSection />
      <AppointmentSection />
      <WhyChooseUsSection />
      {/* <TestimonialsSection /> */}
      <FAQSection />
    </div>
  );
};

export default HomePage;

import { Link } from 'react-router-dom';
import { Search, Grid, Calendar, Siren } from 'lucide-react';

const QuickAccessSection = () => {
  const items = [
    { 
      title: "Find a Doctor", 
      icon: Search, 
      link: "/#doctors", 
      color: "bg-blue-50 text-primary hover:bg-primary hover:text-white"
    },
    { 
      title: "Our Departments", 
      icon: Grid, 
      link: "/#departments", 
      color: "bg-blue-50 text-primary hover:bg-primary hover:text-white"
    },
    { 
      title: "Book Appointment", 
      icon: Calendar, 
      link: "/#book", 
      color: "bg-primary text-white hover:bg-primary/90"
    },
    { 
      title: "Emergency Services", 
      icon: Siren, 
      link: "/#emergency", 
      color: "bg-emergency text-white hover:bg-emergency/90"
    }
  ];

  return (
    <section className="bg-hospital-bg relative -mt-12 z-20 pb-16">
      <div className="container-custom grid grid-cols-2 lg:grid-cols-4 gap-4 px-4">
        {items.map((item, idx) => (
          <Link
            key={idx}
            to={item.link}
            className={`flex flex-col items-center justify-center p-8 text-center transition-all duration-300 transform hover:-translate-y-2 rounded-sm border border-divider shadow-md ${item.color}`}
          >
            <item.icon size={36} className="mb-4" />
            <span className="text-lg font-black uppercase tracking-tight">{item.title}</span>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default QuickAccessSection;

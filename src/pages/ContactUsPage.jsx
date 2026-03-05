import { Phone, Mail, MapPin, Clock, MessageSquare, Send } from 'lucide-react';

const ContactUsPage = () => {
  const contactInfo = [
    {
      icon: Phone,
      title: 'Phone Numbers',
      details: ['Phone: +91 91876 34758'],
      // details: ['+91 91876 34758', 'Emergency: 080 4962 4962', 'Toll Free: 1800 202 4969'],
      label: 'Call us'
    },
    {
      icon: Mail,
      title: 'Email Addresses',
      details: ['info@nexusenliven.com'],
      label: 'Email us'
    },
    {
      icon: MapPin,
      title: 'Our Location',
      details: ['NEXUS ENLIVEN HEALTH CENTRE', 'Door No.4-57/A, VIJAYA MAHAL', 'Surathkal, Iddya, Mangaluru Taluk', 'Dakshina Kannada District', 'Karnataka - 575014'],
      label: 'Visit us'
    },
    {
      icon: Clock,
      title: 'Working Hours',
      details: ['OPD: 9:00 AM - 8:00 PM', 'Emergency: 24/7 Available', 'Pharmacy: 24/7 Available'],
      label: 'Timing'
    }
  ];

  return (
    <div className="pt-16 lg:pt-20 min-h-screen">
      {/* Header */}
      <div className="bg-primary/5 py-16 lg:py-24">
        <div className="container-custom text-center">
          <span className="text-secondary font-bold uppercase tracking-[0.3em] text-[10px] mb-4 block">Get In Touch</span>
          <h1 className="text-4xl lg:text-7xl font-bold text-primary mb-6 font-display">
            Contact Us
          </h1>
          <p className="max-w-3xl mx-auto text-gray-600 text-lg lg:text-xl px-4 lg:px-0">
            Have questions or need assistance? Our dedicated team is here to help you. Reach out to us through any of the channels below.
          </p>
        </div>
      </div>

      <div className="container-custom py-16 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          {/* Contact Details */}
          <div className="lg:col-span-1 space-y-10">
            {contactInfo.map((info, index) => {
              const Icon = info.icon;
              return (
                <div key={index} className="flex gap-6 group">
                  <div className="w-14 h-14 bg-white shadow-lg border border-divider rounded-2xl flex items-center justify-center text-secondary group-hover:bg-secondary group-hover:text-white transition-all duration-300 shrink-0">
                    <Icon size={24} />
                  </div>
                  <div>
                    <p className="text-secondary font-bold uppercase tracking-widest text-[10px] mb-1">{info.label}</p>
                    <h3 className="text-xl font-bold text-primary mb-3 font-display">{info.title}</h3>
                    <div className="space-y-1">
                      {info.details.map((detail, idx) => (
                        <p key={idx} className="text-gray-500 font-medium text-sm lg:text-base">{detail}</p>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-1">
            <div className="card-modern p-8 lg:p-12 bg-white">
              <div className="flex items-center gap-4 mb-10">
                <div className="w-12 h-12 bg-primary/5 text-primary rounded-xl flex items-center justify-center">
                  <MessageSquare size={24} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-primary font-display">Send us a Message</h2>
                  <p className="text-gray-500 text-sm">We'll get back to you within 24 hours.</p>
                </div>
              </div>

              <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-1">Full Name</label>
                    <input 
                      type="text" 
                      placeholder="John Doe" 
                      className="w-full bg-hospital-bg border border-divider rounded-xl py-4 px-6 focus:outline-none focus:ring-2 focus:ring-secondary/20 transition-all font-medium"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-1">Email Address</label>
                    <input 
                      type="email" 
                      placeholder="your.email@example.com" 
                      className="w-full bg-hospital-bg border border-divider rounded-xl py-4 px-6 focus:outline-none focus:ring-2 focus:ring-secondary/20 transition-all font-medium"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-1">Phone Number</label>
                    <input 
                      type="tel" 
                      placeholder="+91 00000 00000" 
                      className="w-full bg-hospital-bg border border-divider rounded-xl py-4 px-6 focus:outline-none focus:ring-2 focus:ring-secondary/20 transition-all font-medium"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-1">Subject</label>
                    <select className="w-full bg-hospital-bg border border-divider rounded-xl py-4 px-6 focus:outline-none focus:ring-2 focus:ring-secondary/20 transition-all font-medium appearance-none">
                      <option>General Inquiry</option>
                      <option>Appointment Request</option>
                      <option>Feedback</option>
                      <option>Insurance Question</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-1">Message</label>
                  <textarea 
                    rows="5" 
                    placeholder="How can we help you?" 
                    className="w-full bg-hospital-bg border border-divider rounded-xl py-4 px-6 focus:outline-none focus:ring-2 focus:ring-secondary/20 transition-all font-medium resize-none"
                  ></textarea>
                </div>

                <button className="btn-primary w-full py-5 rounded-xl font-extrabold uppercase tracking-[0.2em] flex items-center justify-center gap-3 shadow-xl">
                  Send Message <Send size={20} />
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Map Placeholder */}
      <section className="container-custom pb-24 lg:pb-32">
        <div className="aspect-[21/9] bg-gray-200 rounded-3xl overflow-hidden relative group">
          <div className="absolute inset-0 bg-primary/10 group-hover:pointer-events-none group-hover:bg-transparent transition-all duration-500"></div>
          <iframe 
                src="https://www.google.com/maps?q=Door+No.4-57/A+VIJAYA+MAHAL+Surathkal+Mangaluru+575014&output=embed"

            // src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d7775.494403084334!2d74.79118287563324!3d12.988014269659146!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba351b1446dffd7%3A0x62e18a30671f13c7!2sNaturals%20Unisex%20Salon%20Surathkal!5e0!3m2!1sen!2sin!4v1772725274540!5m2!1sen!2sin" 
            width="100%" 
            height="100%" 
            style={{ border: 0 }} 
            allowFullScreen="" 
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </section>
    </div>
  );
};

export default ContactUsPage;

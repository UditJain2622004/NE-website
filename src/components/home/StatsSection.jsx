const StatsSection = () => {
  const stats = [
    { value: "25+", label: "Years of Experience" },
    { value: "50+", label: "Expert Doctors" },
    { value: "10,000+", label: "Happy Patients" },
    { value: "15+", label: "Specialized Depts" },
  ];

  return (
    <section className="bg-hospital-bg py-12 lg:py-16">
      <div className="container-custom grid grid-cols-2 lg:grid-cols-4 gap-8">
        {stats.map((stat, idx) => (
          <div key={idx} className="text-center group">
            <div className="text-4xl lg:text-5xl font-black text-secondary mb-2 group-hover:scale-110 transition-transform">
              {stat.value}
            </div>
            <div className="text-primary font-bold uppercase tracking-widest text-xs lg:text-sm border-t border-divider pt-3 inline-block">
              {stat.label}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default StatsSection;

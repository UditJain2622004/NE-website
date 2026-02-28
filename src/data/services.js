export const services = [
  {
    id: 1,
    name: "Clinic",
    slug: "clinic",
    icon: "StethoscopeIcon",
    shortDescription: "Walk-in and scheduled clinical consultations with experienced healthcare professionals for all your primary care needs.",
    fullDescription: "Our Clinic offers comprehensive outpatient care in a comfortable, modern environment. From routine health check-ups to management of chronic conditions, our experienced team of physicians provides personalized attention and evidence-based treatment plans. Walk-in and scheduled appointments are available to ensure timely access to quality healthcare.",
    image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=90&w=1200&h=900",
    highlights: ["Walk-in & Scheduled Appointments", "Chronic Disease Management", "Preventive Health Screenings", "Minor Procedures & Wound Care", "Health Certificates & Reports"],
    faqs: [
      {
        question: "Do I need an appointment to visit the clinic?",
        answer: "While appointments are recommended for minimal wait time, we do accept walk-in patients during clinic hours."
      },
      {
        question: "What should I bring for my visit?",
        answer: "Please bring a valid ID, any previous medical records, a list of current medications, and your insurance card if applicable."
      }
    ]
  },
  {
    id: 2,
    name: "Consultation",
    slug: "consultation",
    icon: "MessageSquareIcon",
    shortDescription: "Expert medical consultations with specialists across multiple disciplines for accurate diagnosis and treatment guidance.",
    fullDescription: "Our Consultation services connect you with experienced specialists across a wide range of medical disciplines. Whether you need a second opinion, specialist evaluation, or guidance on complex health issues, our consultants provide thorough assessments and evidence-based recommendations tailored to your needs.",
    image: "https://images.unsplash.com/photo-1666214280557-f1b5022eb634?auto=format&fit=crop&q=90&w=1200&h=900",
    highlights: ["Specialist Referrals", "Second Opinion Services", "Multi-disciplinary Evaluations", "Follow-up Care Coordination", "Telemedicine Options"],
    faqs: [
      {
        question: "How do I book a specialist consultation?",
        answer: "You can book a consultation through our reception desk, by phone, or through our online appointment system. A referral from your primary care physician is recommended but not always required."
      },
      {
        question: "Can I get a consultation online?",
        answer: "Yes, we offer telemedicine consultations for certain specialties. Please contact us to check availability for your specific requirement."
      }
    ]
  },
  {
    id: 3,
    name: "Pharmacy",
    slug: "pharmacy",
    icon: "PillIcon",
    shortDescription: "Full-service in-house pharmacy with a comprehensive range of medications, health products, and expert pharmaceutical advice.",
    fullDescription: "Our in-house Pharmacy provides convenient access to a comprehensive range of prescription and over-the-counter medications. Our licensed pharmacists offer expert guidance on medication usage, potential interactions, and proper dosage. We maintain a well-stocked inventory to ensure patients can fill their prescriptions without delay.",
    image: "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?auto=format&fit=crop&q=90&w=1200&h=900",
    highlights: ["Prescription Dispensing", "Over-the-Counter Medications", "Medication Counseling", "Drug Interaction Checks", "Health & Wellness Products"],
    faqs: [
      {
        question: "Is the pharmacy open on weekends?",
        answer: "Yes, our pharmacy operates on weekends with slightly adjusted hours. Please contact us for the current weekend schedule."
      },
      {
        question: "Can I get my prescription refilled here?",
        answer: "Yes, we handle prescription refills. Please bring your previous prescription or medication packaging for quick processing."
      }
    ]
  },
  {
    id: 4,
    name: "Health Check Packages",
    slug: "health-check-packages",
    icon: "PackageIcon",
    shortDescription: "Curated health checkup packages designed to assess your overall well-being with comprehensive tests and specialist consultations.",
    fullDescription: "Our Health Check Packages offer a range of curated health assessments — from basic screenings to executive-level comprehensive checkups. Each package is designed to give you a complete picture of your health with bundled tests, imaging, and specialist consultations at value-driven pricing.",
    image: "/general images/health package.png",
    customPage: true,
    highlights: ["Basic to Executive Packages", "Bundled Tests & Imaging", "Specialist Consultations Included", "Value-Driven Pricing", "Detailed Wellness Reports"],
    faqs: [
      {
        question: "How do I choose the right package?",
        answer: "Choose based on your age, health concerns, and goals. Basic packages suit routine monitoring, while comprehensive and executive packages are ideal for in-depth assessments."
      },
      {
        question: "Can I customize a package?",
        answer: "Yes, our team can help you add or modify tests based on your specific needs. Contact us for a personalized package."
      }
    ]
  },
  {
    id: 5,
    name: "Day Care Health Service",
    slug: "day-care-health-service",
    icon: "SunIcon",
    shortDescription: "Short-stay medical procedures and treatments that don't require overnight hospitalization, ensuring quick recovery.",
    fullDescription: "Our Day Care Health Services provide a range of medical procedures and treatments that can be completed within a single day, eliminating the need for overnight hospital stays. From minor surgeries to infusion therapies and specialized treatments, our day care facility is equipped with modern amenities to ensure patient comfort and safety throughout the process.",
    image: "https://images.unsplash.com/photo-1538108149393-fbbd81895907?auto=format&fit=crop&q=90&w=1200&h=900",
    highlights: ["Minor Surgical Procedures", "Infusion & IV Therapies", "Chemotherapy Sessions", "Post-Operative Monitoring", "Short-Stay Recovery Suites"],
    faqs: [
      {
        question: "What types of procedures are available as day care?",
        answer: "We offer a range of day care procedures including minor surgeries, endoscopies, biopsies, chemotherapy sessions, and various infusion therapies. Your doctor will advise if your procedure qualifies for day care."
      },
      {
        question: "How long will I need to stay?",
        answer: "Most day care procedures require 4-8 hours of stay including preparation, the procedure, and post-procedural observation. Your care team will provide specific time estimates."
      }
    ]
  },
  {
    id: 6,
    name: "Diagnostics",
    slug: "diagnostics",
    icon: "ScanLineIcon",
    shortDescription: "State-of-the-art diagnostic services including laboratory testing, imaging, and advanced screening for accurate health assessments.",
    fullDescription: "Our Diagnostics department is equipped with cutting-edge technology to provide accurate and comprehensive diagnostic services. From routine blood tests and pathology to advanced imaging and specialized screening programs, we deliver reliable results with quick turnaround times. Our skilled technicians and diagnostic specialists ensure precision in every test.",
    image: "/general images/diagnostic.jpg",
    highlights: ["Blood Tests & Pathology", "Imaging Services (X-Ray, Ultrasound)", "ECG & Cardiac Monitoring", "Allergy Testing", "Comprehensive Health Packages"],
    faqs: [
      {
        question: "Do I need a doctor's referral for diagnostic tests?",
        answer: "Some tests require a doctor's referral while basic health checkup packages can be availed directly. We recommend consulting with a physician for the most relevant tests."
      },
      {
        question: "How quickly can I get my test results?",
        answer: "Turnaround times vary by test type. Routine blood work results are typically available within 24-48 hours, while specialized tests may take longer. Urgent tests can be expedited."
      }
    ]
  },
  {
    id: 7,
    name: "Occupational / Industrial Health",
    slug: "occupational-industrial-health",
    icon: "HardHatIcon",
    shortDescription: "Pre-employment and periodic medical assessments, workplace health programs, and industrial health services for organizations.",
    fullDescription: "Our Occupational and Industrial Health services provide comprehensive medical assessments and health programs tailored for corporate and industrial clients. We specialize in pre-employment medical examinations, periodic health assessments, fitness-for-duty evaluations, and workplace wellness programs to ensure employee health and regulatory compliance.",
    image: "/general images/industry and occupational.jpg",
    highlights: ["Pre-Employment Medical Exams", "Periodic Medical Assessments", "Fitness-for-Duty Evaluations", "Workplace Health Programs", "Regulatory Compliance Checks"],
    faqs: [
      {
        question: "What does a pre-employment medical assessment include?",
        answer: "A typical pre-employment assessment includes a general physical examination, vision and hearing tests, blood and urine analysis, chest X-ray, and any role-specific tests as prescribed by the employer."
      },
      {
        question: "Can you conduct on-site health camps for our organization?",
        answer: "Yes, we offer on-site health camp services for organizations. This includes health screenings, vaccinations, and wellness awareness sessions. Contact us for a customized proposal."
      }
    ]
  },
  
];

export const departments = [
  {
    id: 1,
    name: "Medicine",
    slug: "medicine",
    icon: "ActivityIcon",
    shortDescription: "Comprehensive general medicine services for diagnosis and treatment of a wide range of health conditions.",
    fullDescription: "Our Medicine department provides expert diagnosis, treatment, and management of a broad spectrum of adult diseases. From routine checkups to complex medical conditions, our experienced physicians deliver personalized care using the latest evidence-based practices.",
    image: "https://images.unsplash.com/photo-1631815588090-d4bfec5b1ccb?auto=format&fit=crop&q=90&w=1200&h=900",
    conditions: ["Diabetes", "Hypertension", "Respiratory Infections", "Fever & Infections", "Thyroid Disorders", "Gastrointestinal Issues"],
    procedures: ["General Health Checkups", "Blood Pressure Monitoring", "Blood Tests & Diagnostics", "ECG", "Medication Management"],
    faqs: [
      {
        question: "When should I see a general physician?",
        answer: "You should see a general physician for any persistent symptoms like fever, fatigue, body aches, or for routine health checkups and preventive care."
      },
      {
        question: "What should I bring to my first appointment?",
        answer: "Please bring a list of your current medications, past medical records, any recent test results, and your insurance information."
      }
    ]
  },
  {
    id: 2,
    name: "Radiology",
    slug: "radiology",
    icon: "MicroscopeIcon",
    shortDescription: "Advanced diagnostic imaging services with state-of-the-art technology for accurate diagnosis.",
    fullDescription: "Our Radiology department offers a full range of diagnostic imaging services using cutting-edge technology. From X-rays and ultrasounds to CT scans and MRIs, our skilled radiologists provide accurate and timely reports to support effective treatment planning.",
    image: "https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=90&w=1200&h=900",
    conditions: ["Fractures & Bone Injuries", "Tumors & Growths", "Internal Organ Abnormalities", "Vascular Conditions"],
    procedures: ["X-Ray", "Ultrasound", "CT Scan", "MRI", "Doppler Studies", "Fluoroscopy"],
    faqs: [
      {
        question: "Do I need a doctor's referral for imaging?",
        answer: "Yes, most imaging procedures require a referral from your treating physician to ensure the right test is conducted for your condition."
      },
      {
        question: "Are imaging procedures safe?",
        answer: "Modern imaging equipment uses minimal radiation and is considered very safe. Our radiologists follow strict safety protocols for all procedures."
      }
    ]
  },
  {
    id: 3,
    name: "Paediatrics",
    slug: "paediatrics",
    icon: "UserGroupIcon",
    shortDescription: "Compassionate and specialized healthcare for infants, children, and adolescents.",
    fullDescription: "Our Paediatrics department is dedicated to the physical, emotional, and developmental health of children from birth through adolescence. We provide a child-friendly environment with specialized neonatal care, vaccinations, growth monitoring, and treatment for childhood illnesses.",
    image: "https://images.unsplash.com/photo-1581594693702-fbdc51b2763b?auto=format&fit=crop&q=90&w=1200&h=900",
    conditions: ["Childhood Infections", "Asthma", "Developmental Delays", "Nutritional Disorders", "Neonatal Conditions", "Allergies"],
    procedures: ["Vaccinations", "Well-child Checkups", "Growth Monitoring", "Hearing & Vision Screening", "Neonatal Intensive Care"],
    faqs: [
      {
        question: "How often should my child have a checkup?",
        answer: "Frequent checkups are recommended in infancy, followed by annual visits for older children and adolescents."
      },
      {
        question: "What age group does the paediatrics department cover?",
        answer: "We provide care for children from birth (including neonatal care) through 18 years of age."
      }
    ]
  },
  {
    id: 4,
    name: "Endocrinology",
    slug: "endocrinology",
    icon: "HeartIcon",
    shortDescription: "Expert care for hormonal and metabolic disorders including diabetes and thyroid conditions.",
    fullDescription: "Our Endocrinology department specializes in the diagnosis and management of hormonal imbalances and metabolic disorders. From diabetes management and thyroid conditions to adrenal and pituitary disorders, our specialists provide comprehensive, personalized treatment plans.",
    image: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=90&w=1200&h=900",
    conditions: ["Diabetes (Type 1 & Type 2)", "Thyroid Disorders", "PCOS", "Adrenal Disorders", "Pituitary Disorders", "Obesity & Metabolic Syndrome"],
    procedures: ["Thyroid Function Tests", "HbA1c Monitoring", "Hormone Level Testing", "Insulin Therapy Management", "Bone Density Scan"],
    faqs: [
      {
        question: "When should I see an endocrinologist?",
        answer: "You should consult an endocrinologist if you have persistent issues with blood sugar, unexplained weight changes, thyroid problems, or other hormonal imbalances."
      },
      {
        question: "Is diabetes management available here?",
        answer: "Yes, we offer comprehensive diabetes care including diagnosis, insulin management, dietary guidance, and long-term monitoring."
      }
    ]
  }
];

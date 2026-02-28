export const departments = [
  {
    id: 1,
    name: "Medicine",
    slug: "medicine",
    icon: "ActivityIcon",
    comingSoon: false,
    shortDescription: "Comprehensive general medicine services for diagnosis and treatment of a wide range of health conditions.",
    fullDescription: "Our Medicine department provides expert diagnosis, treatment, and management of a broad spectrum of adult diseases. From routine checkups to complex medical conditions, our experienced physicians deliver personalized care using the latest evidence-based practices.",
    image: "/general images/general_medicine.jpeg",
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
    comingSoon: false,
    shortDescription: "Advanced diagnostic imaging services with state-of-the-art technology for accurate diagnosis.",
    fullDescription: "Our Radiology department offers a full range of diagnostic imaging services using cutting-edge technology. From X-rays and ultrasounds to CT scans and MRIs, our skilled radiologists provide accurate and timely reports to support effective treatment planning.",
    image: "/general images/radiology.jpeg",
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
    name: "Pediatrics",
    slug: "Pediatrics",
    icon: "UserGroupIcon",
    comingSoon: false,
    shortDescription: "Compassionate and specialized healthcare for infants, children, and adolescents.",
    fullDescription: "Our Pediatrics department is dedicated to the physical, emotional, and developmental health of children from birth through adolescence. We provide a child-friendly environment with specialized neonatal care, vaccinations, growth monitoring, and treatment for childhood illnesses.",
    image: "/general images/pediatrics2.jpeg",
    conditions: ["Childhood Infections", "Asthma", "Developmental Delays", "Nutritional Disorders", "Neonatal Conditions", "Allergies"],
    procedures: ["Vaccinations", "Well-child Checkups", "Growth Monitoring", "Hearing & Vision Screening", "Neonatal Intensive Care"],
    faqs: [
      {
        question: "How often should my child have a checkup?",
        answer: "Frequent checkups are recommended in infancy, followed by annual visits for older children and adolescents."
      },
      {
        question: "What age group does the Pediatrics department cover?",
        answer: "We provide care for children from birth (including neonatal care) through 18 years of age."
      }
    ]
  },
  {
    id: 4,
    name: "Endocrinology",
    slug: "endocrinology",
    icon: "HeartIcon",
    comingSoon: false,
    shortDescription: "Expert care for hormonal and metabolic disorders including diabetes and thyroid conditions.",
    fullDescription: "Our Endocrinology department specializes in the diagnosis and management of hormonal imbalances and metabolic disorders. From diabetes management and thyroid conditions to adrenal and pituitary disorders, our specialists provide comprehensive, personalized treatment plans.",
    image: "/general images/Endocrinology.jpeg",
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
  },
  {
    id: 5,
    name: "Cardiology",
    slug: "cardiology",
    icon: "HeartIcon",
    comingSoon: true,
    shortDescription: "Comprehensive heart care services including diagnosis, treatment, and management of cardiovascular diseases.",
    fullDescription: "Our Cardiology department will offer advanced cardiac care with state-of-the-art diagnostic and treatment facilities. From preventive cardiology and risk assessment to interventional procedures and cardiac rehabilitation, our team of experienced cardiologists will provide holistic heart care.",
    image: "/general images/Cardiology7.jpeg",
    conditions: ["Coronary Artery Disease", "Heart Failure", "Arrhythmias", "Hypertension", "Valvular Heart Disease", "Congenital Heart Defects"],
    procedures: ["ECG & Echocardiography", "Stress Testing", "Holter Monitoring", "Angiography", "Cardiac Catheterization", "Pacemaker Implantation"],
    faqs: [
      {
        question: "When should I see a cardiologist?",
        answer: "You should consult a cardiologist if you experience chest pain, shortness of breath, palpitations, dizziness, or have risk factors such as high blood pressure, high cholesterol, diabetes, or a family history of heart disease."
      },
      {
        question: "What diagnostic tests are available?",
        answer: "We will offer a full range of cardiac diagnostics including ECG, echocardiography, stress tests, Holter monitoring, and advanced imaging."
      }
    ]
  },
  {
    id: 6,
    name: "ENT (Ear Nose & Throat)",
    slug: "ent",
    icon: "ActivityIcon",
    comingSoon: true,
    shortDescription: "Specialized diagnosis and treatment for conditions affecting the ear, nose, throat, head, and neck.",
    fullDescription: "Our ENT department will provide comprehensive care for disorders of the ear, nose, throat, and related structures of the head and neck. From hearing loss and sinusitis to voice disorders and head & neck tumors, our specialists will deliver precise diagnoses and effective treatments.",
    image: "/general images/ENT (Ear Nose & Throat)4.jpeg",
    conditions: ["Hearing Loss", "Sinusitis", "Tonsillitis", "Vertigo & Balance Disorders", "Voice Disorders", "Allergic Rhinitis"],
    procedures: ["Audiometry & Hearing Tests", "Endoscopic Sinus Surgery", "Tonsillectomy", "Septoplasty", "Microlaryngoscopy", "Allergy Testing"],
    faqs: [
      {
        question: "What conditions does an ENT specialist treat?",
        answer: "ENT specialists treat a wide range of conditions including ear infections, hearing loss, sinusitis, tonsillitis, voice disorders, sleep apnea, and head & neck tumors."
      },
      {
        question: "When will this department be available?",
        answer: "We are currently setting up this department with the latest equipment and top specialists. Please check back soon or contact us for updates."
      }
    ]
  },
  {
    id: 7,
    name: "Obstetrics and Gynecology",
    slug: "obstetrics-and-gynecology",
    icon: "UserGroupIcon",
    comingSoon: true,
    shortDescription: "Complete women's healthcare including prenatal care, delivery services, and gynecological treatments.",
    fullDescription: "Our Obstetrics and Gynecology department will offer comprehensive women's healthcare services. From routine gynecological exams and prenatal care to high-risk pregnancies and minimally invasive surgeries, our specialists will provide compassionate, personalized care through every stage of a woman's life.",
    image: "/general images/Obstetrics and Gynecology.jpeg",
    conditions: ["Pregnancy Care", "PCOS", "Endometriosis", "Menstrual Disorders", "Uterine Fibroids", "Infertility"],
    procedures: ["Prenatal Screening", "Ultrasound Imaging", "Normal & C-Section Delivery", "Laparoscopic Surgery", "Pap Smear & Cancer Screening", "Fertility Treatments"],
    faqs: [
      {
        question: "What services will be offered?",
        answer: "We will offer complete obstetric and gynecological care including prenatal checkups, delivery services, gynecological surgeries, fertility consultations, and preventive screenings."
      },
      {
        question: "Will high-risk pregnancy care be available?",
        answer: "Yes, our department will be equipped to handle high-risk pregnancies with specialized monitoring and care protocols."
      }
    ]
  },
  {
    id: 8,
    name: "Ophthalmology",
    slug: "ophthalmology",
    icon: "EyeIcon",
    comingSoon: true,
    shortDescription: "Advanced eye care services for diagnosis, treatment, and surgical management of vision and eye disorders.",
    fullDescription: "Our Ophthalmology department will provide comprehensive eye care ranging from routine vision checkups to advanced surgical procedures. With cutting-edge diagnostic equipment and experienced eye care specialists, we will address a full spectrum of ocular conditions to preserve and restore your vision.",
    image: "/general images/Ophthalmology.jpeg",
    conditions: ["Cataracts", "Glaucoma", "Diabetic Retinopathy", "Macular Degeneration", "Refractive Errors", "Dry Eye Syndrome"],
    procedures: ["Cataract Surgery", "Glaucoma Treatment", "Retinal Screening", "Vision Correction (LASIK)", "Eye Pressure Testing", "Fundoscopy"],
    faqs: [
      {
        question: "What eye conditions will be treated?",
        answer: "We will treat a wide range of eye conditions including cataracts, glaucoma, diabetic eye disease, macular degeneration, refractive errors, and eye infections."
      },
      {
        question: "Will laser eye surgery be available?",
        answer: "Yes, we plan to offer advanced laser treatments including LASIK and other refractive correction procedures."
      }
    ]
  },
  {
    id: 9,
    name: "Urology",
    slug: "urology",
    icon: "ActivityIcon",
    comingSoon: true,
    shortDescription: "Specialized care for urinary tract and male reproductive system disorders with advanced diagnostic and surgical options.",
    fullDescription: "Our Urology department will offer expert diagnosis and treatment of conditions affecting the urinary system and male reproductive organs. From kidney stones and urinary infections to prostate conditions and minimally invasive urological surgeries, our specialists will provide evidence-based, patient-centered care.",
    image: "/general images/Urology2.jpeg",
    conditions: ["Kidney Stones", "Urinary Tract Infections", "Prostate Conditions", "Bladder Disorders", "Male Infertility", "Urinary Incontinence"],
    procedures: ["Urinalysis & Imaging", "Lithotripsy", "Cystoscopy", "Prostate Biopsy", "Minimally Invasive Surgery", "Urodynamic Testing"],
    faqs: [
      {
        question: "When should I see a urologist?",
        answer: "You should see a urologist if you experience persistent urinary symptoms such as pain, blood in urine, difficulty urinating, or recurrent infections."
      },
      {
        question: "What treatments will be available?",
        answer: "We will offer both medical and surgical treatments including minimally invasive procedures, lithotripsy for kidney stones, and advanced prostate care."
      }
    ]
  }
];

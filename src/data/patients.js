export const SAMPLE_PATIENTS = [
  {
    id: '1',
    firstName: 'María',
    lastName: 'González',
    dni: '32.456.789',
    birthDate: '1990-05-15',
    sex: 'F',
    occupation: 'Arquitecta',
    contact: { email: 'maria.g@email.com', phone: '11-4567-8901' },
    status: 'ACTIVE',
    createdAt: '2024-01-10',
    pathologies: ['Diabetes T2', 'HTA'],
    allergies: ['Frutos secos'],
    objectives: ['Control glucémico', 'Descenso de peso'],
    medications: ['Metformina 850mg'],
    physicalActivity: 'MODERADO',
    anthropometry: [
      { date: '2024-01-10', weight: 75.5, height: 165, imc: 27.7, imcCategory: 'Sobrepeso', waistCirc: 88, hipCirc: 102, icc: 0.86 },
      { date: '2024-02-12', weight: 73.2, height: 165, imc: 26.9, imcCategory: 'Sobrepeso', waistCirc: 86, hipCirc: 101, icc: 0.85 },
      { date: '2024-03-15', weight: 71.8, height: 165, imc: 26.4, imcCategory: 'Sobrepeso', waistCirc: 84, hipCirc: 100, icc: 0.84 }
    ],
    requirements: { eer: 1850, proteins_g: 92, proteins_pct: 20, carbs_g: 231, carbs_pct: 50, fats_g: 62, fats_pct: 30, fiber_g: 25 }
  },
  {
    id: '2',
    firstName: 'Carlos',
    lastName: 'Pérez',
    dni: '28.123.456',
    birthDate: '1985-11-20',
    sex: 'M',
    occupation: 'Ingeniero',
    contact: { email: 'cperez@email.com', phone: '11-5678-1234' },
    status: 'ACTIVE',
    createdAt: '2024-02-05',
    pathologies: [],
    allergies: [],
    objectives: ['Hipertrofia', 'Mejorar rendimiento'],
    medications: [],
    physicalActivity: 'INTENSO',
    anthropometry: [
      { date: '2024-02-05', weight: 82.0, height: 180, imc: 25.3, imcCategory: 'Normal', waistCirc: 92, hipCirc: 104, icc: 0.88 },
      { date: '2024-03-08', weight: 83.5, height: 180, imc: 25.8, imcCategory: 'Sobrepeso', waistCirc: 91, hipCirc: 104, icc: 0.87 }
    ],
    requirements: { eer: 3200, proteins_g: 160, proteins_pct: 20, carbs_g: 440, carbs_pct: 55, fats_g: 88, fats_pct: 25, fiber_g: 30 }
  },
  {
    id: '3',
    firstName: 'Lucía',
    lastName: 'Martínez',
    dni: '40.987.654',
    birthDate: '1998-02-28',
    sex: 'F',
    occupation: 'Estudiante',
    contact: { email: 'luciam@email.com', phone: '11-9876-5432' },
    status: 'ACTIVE',
    createdAt: '2024-04-01',
    pathologies: ['Anemia ferropénica'],
    allergies: ['Lactosa'],
    objectives: ['Mejorar niveles de hierro', 'Vegetarianismo'],
    medications: ['Hierro 100mg'],
    physicalActivity: 'LEVE',
    anthropometry: [
      { date: '2024-04-01', weight: 58.0, height: 160, imc: 22.7, imcCategory: 'Normal', waistCirc: 72, hipCirc: 95, icc: 0.76 }
    ],
    requirements: { eer: 1700, proteins_g: 68, proteins_pct: 16, carbs_g: 233, carbs_pct: 55, fats_g: 55, fats_pct: 29, fiber_g: 28 }
  }
];

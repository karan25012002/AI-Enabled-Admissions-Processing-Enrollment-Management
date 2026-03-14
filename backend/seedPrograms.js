require('dotenv').config();
const mongoose = require('mongoose');
const Program = require('./models/Program');

const programs = [
  // Engineering & Technology
  { programName: 'B.Tech (Bachelor of Technology)', description: 'Bachelor of Technology program', duration: '4 Years', seats: 120, category: 'Engineering', minGPA: 6.0, minEntranceScore: 60, eligibilityCriteria: '10+2 with Physics, Chemistry, Mathematics' },
  { programName: 'B.E (Bachelor of Engineering)', description: 'Bachelor of Engineering program', duration: '4 Years', seats: 120, category: 'Engineering', minGPA: 6.0, minEntranceScore: 60, eligibilityCriteria: '10+2 with Physics, Chemistry, Mathematics' },
  { programName: 'BCA (Bachelor of Computer Applications)', description: 'Bachelor of Computer Applications', duration: '3 Years', seats: 60, category: 'Engineering', minGPA: 5.0, minEntranceScore: 50, eligibilityCriteria: '10+2 with Mathematics' },
  { programName: 'B.Sc Computer Science', description: 'B.Sc in Computer Science', duration: '3 Years', seats: 60, category: 'Science', minGPA: 5.0, minEntranceScore: 50, eligibilityCriteria: '10+2 with Science stream' },
  { programName: 'B.Sc IT', description: 'B.Sc in Information Technology', duration: '3 Years', seats: 60, category: 'Science', minGPA: 5.0, minEntranceScore: 50, eligibilityCriteria: '10+2 with Science stream' },
  { programName: 'M.Tech', description: 'Master of Technology', duration: '2 Years', seats: 60, category: 'Engineering', minGPA: 6.5, minEntranceScore: 60, eligibilityCriteria: 'B.Tech/B.E in relevant field' },
  { programName: 'ME', description: 'Master of Engineering', duration: '2 Years', seats: 60, category: 'Engineering', minGPA: 6.5, minEntranceScore: 60, eligibilityCriteria: 'B.Tech/B.E in relevant field' },
  { programName: 'MCA', description: 'Master of Computer Applications', duration: '2 Years', seats: 60, category: 'Engineering', minGPA: 6.0, minEntranceScore: 55, eligibilityCriteria: 'BCA or B.Sc in related field with Mathematics' },
  
  // Science
  { programName: 'B.Sc Physics', description: 'B.Sc in Physics', duration: '3 Years', seats: 60, category: 'Science', minGPA: 5.0, minEntranceScore: 50, eligibilityCriteria: '10+2 with Physics' },
  { programName: 'B.Sc Chemistry', description: 'B.Sc in Chemistry', duration: '3 Years', seats: 60, category: 'Science', minGPA: 5.0, minEntranceScore: 50, eligibilityCriteria: '10+2 with Chemistry' },
  { programName: 'B.Sc Mathematics', description: 'B.Sc in Mathematics', duration: '3 Years', seats: 60, category: 'Science', minGPA: 5.0, minEntranceScore: 50, eligibilityCriteria: '10+2 with Mathematics' },
  { programName: 'B.Sc Biotechnology', description: 'B.Sc in Biotechnology', duration: '3 Years', seats: 60, category: 'Science', minGPA: 5.0, minEntranceScore: 50, eligibilityCriteria: '10+2 with Biology' },
  { programName: 'B.Sc Microbiology', description: 'B.Sc in Microbiology', duration: '3 Years', seats: 60, category: 'Science', minGPA: 5.0, minEntranceScore: 50, eligibilityCriteria: '10+2 with Biology' },
  { programName: 'M.Sc Physics', description: 'M.Sc in Physics', duration: '2 Years', seats: 40, category: 'Science', minGPA: 6.0, minEntranceScore: 55, eligibilityCriteria: 'B.Sc Physics' },
  { programName: 'M.Sc Chemistry', description: 'M.Sc in Chemistry', duration: '2 Years', seats: 40, category: 'Science', minGPA: 6.0, minEntranceScore: 55, eligibilityCriteria: 'B.Sc Chemistry' },
  { programName: 'M.Sc Mathematics', description: 'M.Sc in Mathematics', duration: '2 Years', seats: 40, category: 'Science', minGPA: 6.0, minEntranceScore: 55, eligibilityCriteria: 'B.Sc Mathematics' },
  { programName: 'M.Sc Biotechnology', description: 'M.Sc in Biotechnology', duration: '2 Years', seats: 40, category: 'Science', minGPA: 6.0, minEntranceScore: 55, eligibilityCriteria: 'B.Sc Biotechnology/Biology' },
  
  // Commerce & Management
  { programName: 'B.Com (Bachelor of Commerce)', description: 'Bachelor of Commerce', duration: '3 Years', seats: 120, category: 'Commerce', minGPA: 5.0, minEntranceScore: 40, eligibilityCriteria: '10+2 in Commerce or related' },
  { programName: 'BBA (Bachelor of Business Administration)', description: 'Bachelor of Business Administration', duration: '3 Years', seats: 120, category: 'Management', minGPA: 5.0, minEntranceScore: 45, eligibilityCriteria: '10+2 in any stream' },
  { programName: 'BMS (Bachelor of Management Studies)', description: 'Bachelor of Management Studies', duration: '3 Years', seats: 60, category: 'Management', minGPA: 5.0, minEntranceScore: 45, eligibilityCriteria: '10+2 in any stream' },
  { programName: 'MBA (Master of Business Administration)', description: 'Master of Business Administration', duration: '2 Years', seats: 120, category: 'Management', minGPA: 6.0, minEntranceScore: 60, eligibilityCriteria: 'Graduation in any stream' },
  { programName: 'M.Com', description: 'Master of Commerce', duration: '2 Years', seats: 60, category: 'Commerce', minGPA: 5.5, minEntranceScore: 50, eligibilityCriteria: 'B.Com or equivalent' },

  // Arts & Humanities
  { programName: 'BA English', description: 'BA in English Literature', duration: '3 Years', seats: 60, category: 'Arts', minGPA: 5.0, minEntranceScore: 40, eligibilityCriteria: '10+2 in any stream' },
  { programName: 'BA History', description: 'BA in History', duration: '3 Years', seats: 60, category: 'Arts', minGPA: 5.0, minEntranceScore: 40, eligibilityCriteria: '10+2 in any stream' },
  { programName: 'BA Political Science', description: 'BA in Political Science', duration: '3 Years', seats: 60, category: 'Arts', minGPA: 5.0, minEntranceScore: 40, eligibilityCriteria: '10+2 in any stream' },
  { programName: 'BA Economics', description: 'BA in Economics', duration: '3 Years', seats: 60, category: 'Arts', minGPA: 5.0, minEntranceScore: 40, eligibilityCriteria: '10+2 in any stream' },
  { programName: 'BA Sociology', description: 'BA in Sociology', duration: '3 Years', seats: 60, category: 'Arts', minGPA: 5.0, minEntranceScore: 40, eligibilityCriteria: '10+2 in any stream' },
  { programName: 'BA Psychology', description: 'BA in Psychology', duration: '3 Years', seats: 60, category: 'Arts', minGPA: 5.0, minEntranceScore: 40, eligibilityCriteria: '10+2 in any stream' },
  { programName: 'MA English', description: 'MA in English Literature', duration: '2 Years', seats: 40, category: 'Arts', minGPA: 5.5, minEntranceScore: 50, eligibilityCriteria: 'BA in relevant field' },
  { programName: 'MA Economics', description: 'MA in Economics', duration: '2 Years', seats: 40, category: 'Arts', minGPA: 5.5, minEntranceScore: 50, eligibilityCriteria: 'BA in relevant field' },
  { programName: 'MA Political Science', description: 'MA in Political Science', duration: '2 Years', seats: 40, category: 'Arts', minGPA: 5.5, minEntranceScore: 50, eligibilityCriteria: 'BA in relevant field' },
  { programName: 'MA Sociology', description: 'MA in Sociology', duration: '2 Years', seats: 40, category: 'Arts', minGPA: 5.5, minEntranceScore: 50, eligibilityCriteria: 'BA in relevant field' },

  // Medical & Health
  { programName: 'MBBS', description: 'Bachelor of Medicine and Bachelor of Surgery', duration: '5.5 Years', seats: 150, category: 'Medicine', minGPA: 7.0, minEntranceScore: 80, eligibilityCriteria: '10+2 with Physics, Chemistry, Biology and NEET' },
  { programName: 'BDS (Dentistry)', description: 'Bachelor of Dental Surgery', duration: '5 Years', seats: 100, category: 'Medicine', minGPA: 7.0, minEntranceScore: 75, eligibilityCriteria: '10+2 with Physics, Chemistry, Biology and NEET' },
  { programName: 'B.Pharm (Pharmacy)', description: 'Bachelor of Pharmacy', duration: '4 Years', seats: 60, category: 'Medicine', minGPA: 6.0, minEntranceScore: 60, eligibilityCriteria: '10+2 with Physics, Chemistry, Biology/Maths' },
  { programName: 'B.Sc Nursing', description: 'B.Sc in Nursing', duration: '4 Years', seats: 60, category: 'Medicine', minGPA: 6.0, minEntranceScore: 60, eligibilityCriteria: '10+2 with Physics, Chemistry, Biology' },
  { programName: 'BPT (Physiotherapy)', description: 'Bachelor of Physiotherapy', duration: '4.5 Years', seats: 60, category: 'Medicine', minGPA: 6.0, minEntranceScore: 60, eligibilityCriteria: '10+2 with Physics, Chemistry, Biology' },
  { programName: 'MD', description: 'Doctor of Medicine', duration: '3 Years', seats: 30, category: 'Medicine', minGPA: 6.5, minEntranceScore: 70, eligibilityCriteria: 'MBBS' },
  { programName: 'MS', description: 'Master of Surgery', duration: '3 Years', seats: 30, category: 'Medicine', minGPA: 6.5, minEntranceScore: 70, eligibilityCriteria: 'MBBS' },
  { programName: 'MDS', description: 'Master of Dental Surgery', duration: '3 Years', seats: 20, category: 'Medicine', minGPA: 6.5, minEntranceScore: 70, eligibilityCriteria: 'BDS' },
  { programName: 'M.Pharm', description: 'Master of Pharmacy', duration: '2 Years', seats: 40, category: 'Medicine', minGPA: 6.0, minEntranceScore: 60, eligibilityCriteria: 'B.Pharm' },

  // Law
  { programName: 'LLB', description: 'Bachelor of Laws', duration: '3 Years', seats: 120, category: 'Law', minGPA: 5.5, minEntranceScore: 50, eligibilityCriteria: 'Graduation in any stream' },
  { programName: 'BA LLB', description: 'Integrated BA LLB', duration: '5 Years', seats: 120, category: 'Law', minGPA: 6.0, minEntranceScore: 60, eligibilityCriteria: '10+2 in any stream' },
  { programName: 'BBA LLB', description: 'Integrated BBA LLB', duration: '5 Years', seats: 120, category: 'Law', minGPA: 6.0, minEntranceScore: 60, eligibilityCriteria: '10+2 in any stream' },

  // Education
  { programName: 'B.Ed (Bachelor of Education)', description: 'Bachelor of Education', duration: '2 Years', seats: 100, category: 'Education', minGPA: 5.5, minEntranceScore: 50, eligibilityCriteria: 'Graduation in any stream' },
  { programName: 'M.Ed', description: 'Master of Education', duration: '2 Years', seats: 50, category: 'Education', minGPA: 5.5, minEntranceScore: 50, eligibilityCriteria: 'B.Ed' },

  // Design & Media
  { programName: 'B.Des (Design)', description: 'Bachelor of Design', duration: '4 Years', seats: 60, category: 'Design', minGPA: 5.5, minEntranceScore: 50, eligibilityCriteria: '10+2 in any stream' },
  { programName: 'BJMC (Journalism & Mass Communication)', description: 'Bachelor of Journalism and Mass Communication', duration: '3 Years', seats: 60, category: 'Arts', minGPA: 5.0, minEntranceScore: 40, eligibilityCriteria: '10+2 in any stream' },
  { programName: 'BFA (Fine Arts)', description: 'Bachelor of Fine Arts', duration: '4 Years', seats: 60, category: 'Arts', minGPA: 5.0, minEntranceScore: 40, eligibilityCriteria: '10+2 in any stream' },

  // Doctoral Programs (Research Degrees)
  { programName: 'PhD in Computer Science', description: 'Doctoral Program in CS', duration: '3-5 Years', seats: 10, category: 'Science', minGPA: 7.0, minEntranceScore: 70, eligibilityCriteria: 'Master degree in relevant field' },
  { programName: 'PhD in Engineering', description: 'Doctoral Program in Engineering', duration: '3-5 Years', seats: 10, category: 'Engineering', minGPA: 7.0, minEntranceScore: 70, eligibilityCriteria: 'M.Tech/ME or equivalent' },
  { programName: 'PhD in Physics', description: 'Doctoral Program in Physics', duration: '3-5 Years', seats: 10, category: 'Science', minGPA: 7.0, minEntranceScore: 70, eligibilityCriteria: 'Master degree in relevant field' },
  { programName: 'PhD in Management', description: 'Doctoral Program in Management', duration: '3-5 Years', seats: 10, category: 'Management', minGPA: 7.0, minEntranceScore: 70, eligibilityCriteria: 'MBA or Master degree in relevant field' },
  { programName: 'PhD in Economics', description: 'Doctoral Program in Economics', duration: '3-5 Years', seats: 10, category: 'Arts', minGPA: 7.0, minEntranceScore: 70, eligibilityCriteria: 'Master degree in relevant field' },
  { programName: 'PhD in Biotechnology', description: 'Doctoral Program in Biotechnology', duration: '3-5 Years', seats: 10, category: 'Science', minGPA: 7.0, minEntranceScore: 70, eligibilityCriteria: 'Master degree in relevant field' },
  { programName: 'PhD in Education', description: 'Doctoral Program in Education', duration: '3-5 Years', seats: 10, category: 'Education', minGPA: 7.0, minEntranceScore: 70, eligibilityCriteria: 'M.Ed or Master degree in relevant field' },

  // Diploma & Certificate Programs
  { programName: 'Diploma in Computer Applications', description: 'Diploma in Computer Applications', duration: '1 Year', seats: 60, category: 'Other', minGPA: 5.0, minEntranceScore: 0, eligibilityCriteria: '10+2 in any stream' },
  { programName: 'Diploma in Web Development', description: 'Diploma in Web Development', duration: '1 Year', seats: 60, category: 'Other', minGPA: 5.0, minEntranceScore: 0, eligibilityCriteria: '10+2 in any stream' },
  { programName: 'Diploma in Artificial Intelligence', description: 'Diploma in Artificial Intelligence', duration: '1 Year', seats: 60, category: 'Other', minGPA: 5.0, minEntranceScore: 0, eligibilityCriteria: '10+2 in any stream' },
  { programName: 'Diploma in Digital Marketing', description: 'Diploma in Digital Marketing', duration: '1 Year', seats: 60, category: 'Other', minGPA: 5.0, minEntranceScore: 0, eligibilityCriteria: '10+2 in any stream' },
  { programName: 'Certificate in Data Science', description: 'Certificate in Data Science', duration: '6 Months', seats: 60, category: 'Other', minGPA: 5.0, minEntranceScore: 0, eligibilityCriteria: '10+2 in any stream' },
  { programName: 'Certificate in Cyber Security', description: 'Certificate in Cyber Security', duration: '6 Months', seats: 60, category: 'Other', minGPA: 5.0, minEntranceScore: 0, eligibilityCriteria: '10+2 in any stream' }
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 5000 });
    console.log('MongoDB Connected');

    // Fetch existing programs
    const existingPrograms = await Program.find().select('programName -_id');
    const existingNames = new Set(existingPrograms.map(p => p.programName));

    const newPrograms = programs.filter(p => !existingNames.has(p.programName));

    if (newPrograms.length === 0) {
      console.log('All programs already exist. Nothing to add.');
    } else {
      await Program.insertMany(newPrograms);
      console.log(`Successfully added ${newPrograms.length} new programs!`);
    }

    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedDB();

const mongoose = require('mongoose');
const Department = require('./models/Department');
const Class = require('./models/Class');
const Student = require('./models/Student');
require('dotenv').config();

const seedDatabase = async () => {
  try {
    // 1. Connect to DB
    await mongoose.connect(process.env.MONGO_URI); //
    console.log("Connected to DB... 🚀");

    // 2. Clear all existing data to prevent duplicates
    await Department.deleteMany({});
    await Class.deleteMany({});
    await Student.deleteMany({});

    // 3. Seed Departments (The top of the hierarchy)
    const createdDepts = await Department.insertMany([
      { name: 'Islamic Studies' },
      { name: 'Arabic Language' },
      { name: 'Computer Science' }
    ]);
    console.log("✅ Departments Seeded");

    // 4. Seed Classes (Linked to specific Department IDs)
    const islamicDept = createdDepts.find(d => d.name === 'Islamic Studies');
    const createdClasses = await Class.insertMany([
      { name: 'Year 1', department: islamicDept._id },
      { name: 'Year 2', department: islamicDept._id }
    ]);
    console.log("✅ Classes Seeded");

    // 5. Seed a Sample Student (Linked to both Dept and Class IDs)
    const year1Class = createdClasses.find(c => c.name === 'Year 1');
    await Student.create({
      name: 'Sample Student',
      department: islamicDept._id,
      className: year1Class._id,
      status: 'Absent'
    });
    console.log("✅ Sample Student Seeded");

    console.log("Database successfully populated! 🎉");
    process.exit();
  } catch (err) {
    console.error("❌ Seeding Error:", err);
    process.exit(1);
  }
};

seedDatabase();
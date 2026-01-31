const express = require("express");
const router = express.Router();
const Department = require("../models/Department");
const Class = require("../models/Class");
const Student = require("../models/Student");

// --- GET ALL DATA ---
router.get("/all-data", async (req, res) => {
  try {
    const departments = await Department.find();
    const classes = await Class.find();
    const students = await Student.find().populate('department').populate('className');
    res.json({ departments, classes, students });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// --- ADDING DATA ---
router.post("/departments/add", async (req, res) => {
  const dept = new Department({ name: req.body.name });
  await dept.save();
  res.status(201).json(dept);
});

router.post("/classes/add", async (req, res) => {
  const newClass = new Class({ name: req.body.name, department: req.body.departmentId });
  await newClass.save();
  res.status(201).json(newClass);
});

router.post("/students/add", async (req, res) => {
  const { name, departmentId, classId } = req.body;
  const count = await Student.countDocuments({ className: classId });
  if (count >= 10) return res.status(400).json({ message: "Class full (Max 10)" });

  const student = new Student({ name, department: departmentId, className: classId });
  await student.save();
  res.status(201).json(student);
});

// --- DELETING DATA (The Fix) ---
router.delete("/departments/delete/:id", async (req, res) => {
  await Department.findByIdAndDelete(req.params.id);
  res.json({ message: "Dept deleted" });
});

router.delete("/classes/delete/:id", async (req, res) => {
  await Class.findByIdAndDelete(req.params.id);
  res.json({ message: "Class deleted. Dept is safe!" });
});

router.delete("/students/delete/:id", async (req, res) => {
  await Student.findByIdAndDelete(req.params.id);
  res.json({ message: "Student deleted" });
});

router.patch("/departments/edit/:id", async (req, res) => {
  try {
    const updated = await Department.findByIdAndUpdate(
      req.params.id,
      { name: req.body.name },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// EDIT CLASS
router.patch("/classes/edit/:id", async (req, res) => {
  try {
    const updated = await Class.findByIdAndUpdate(
      req.params.id,
      { name: req.body.name },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// EDIT STUDENT (Update existing route or add this)
router.patch("/students/attendance/:id", async (req, res) => {
  try {
    const { name, status } = req.body;
    const updateFields = {};
    if (name) updateFields.name = name;
    if (status) updateFields.status = status;

    const updated = await Student.findByIdAndUpdate(
      req.params.id,
      updateFields,
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
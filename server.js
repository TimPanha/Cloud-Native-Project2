// server.js
const express = require('express');
const bodyParser = require('body-parser');
const connectDB = require('./dbconnect');
const Student = require('./models/Student');

const app = express();

// Connect Database
connectDB();

// Middleware
app.use(bodyParser.json());

// 1. Registration API - POST /register
app.post('/register', async (req, res) => {
  try {
    const { sid, sname, semail, spass } = req.body;
    const student = new Student({ sid, sname, semail, spass });
    await student.save();
    res.status(201).json({ msg: 'Student registered successfully', student });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Server error', error });
  }
});

// 2. Login API - POST /login
app.post('/login', async (req, res) => {
  try {
    const { sid, spass } = req.body;
    const student = await Student.findOne({ sid, spass });
    if (!student) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }
    res.status(200).json({ msg: 'Login successful', student });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Server error', error });
  }
});

// 3. Search API - GET /students/:sid
app.get('/students/:sid', async (req, res) => {
  try {
    const student = await Student.findOne({ sid: req.params.sid });
    if (!student) {
      return res.status(404).json({ msg: 'Student not found' });
    }
    res.status(200).json(student);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Server error', error });
  }
});

// 4. Profile Update API - PUT /students/:sid
app.put('/students/:sid', async (req, res) => {
  try {
    const updates = req.body;
    const student = await Student.findOneAndUpdate({ sid: req.params.sid }, updates, { new: true });
    if (!student) {
      return res.status(404).json({ msg: 'Student not found' });
    }
    res.status(200).json({ msg: 'Profile updated successfully', student });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Server error', error });
  }
});

// 5. Delete Student API - DELETE /students/:sid
app.delete('/students/:sid', async (req, res) => {
  try {
    const student = await Student.findOneAndDelete({ sid: req.params.sid });
    if (!student) {
      return res.status(404).json({ msg: 'Student not found' });
    }
    res.status(200).json({ msg: 'Student deleted successfully', student });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Server error', error });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

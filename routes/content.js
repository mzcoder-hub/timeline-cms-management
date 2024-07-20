// backend/routes/contentRoutes.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Content = require('../models/contentModel');
const multer = require('multer');
const path = require('path');

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage });

// Create content
router.post('/', auth, upload.single('file'), async (req, res) => {
  const { title, body, timelineId, deadline, dueDate } = req.body;
  const filePath = req.file ? req.file.path : null;
  const content = await Content.create({
    title,
    body,
    timelineId,
    deadline,
    dueDate,
    filePath
  });
  res.send(content);
});

// Mark content as complete
router.post('/markascomplete/:contentId', auth, async (req, res) => {
  const updateStatus = await Content.update({ status: true }, { where: { id: req.params.contentId} });
  res.send(updateStatus);
});

// Get content by timeline ID
router.get('/:timelineId', auth, async (req, res) => {
  const content = await Content.findAll({ where: { timelineId: req.params.timelineId} });
  res.send(content);
});

module.exports = router;

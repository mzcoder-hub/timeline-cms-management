// backend/routes/timeline.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Timeline = require('../models/timelineModel');

// Create a new timeline
router.post('/', auth, async (req, res) => {
  try {
    console.log({ ...req.body, userId: req.user._id })

    const data = { ...req.body, userId: req.user._id }

    const timeline = await Timeline.create(data);

    console.log(timeline)

    res.status(201).send(timeline);
  } catch (error) {
    res.status(200).send(error)
  }
});

// Get all timelines for the logged-in user
router.get('/', auth, async (req, res) => {
  try {
    const timelines = await Timeline.findAll({ where: { userId: req.user._id } });
    res.send(timelines);
  } catch (error) {
    res.send([])
  }
});

// Get overdue timelines for the logged-in user
router.get('/overdue', auth, async (req, res) => {
  try {
    const timelines = await Timeline.findAll({
      where: {
        userId: req.user._id,
        deadline: {
          [Op.lte]: new Date()
        }
      }
    });
    res.json(timelines);
  } catch (error) {
    res.send([])
  }
});

// Get upcoming timelines for the logged-in user
router.get('/upcoming', auth, async (req, res) => {
  try {
    const timelines = await Timeline.findAll({
      where: {
        userId: req.user._id,
        deadline: {
          [Op.gt]: new Date()
        }
      }
    });
    res.json(timelines);
  } catch (error) {
    res.send([])
  }
});

module.exports = router;

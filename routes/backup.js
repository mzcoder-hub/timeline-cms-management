const express = require('express');
const { parse } = require('json2csv');
const fs = require('fs');
const path = require('path');
const router = express.Router();
const auth = require('../middleware/auth');
const Timeline = require('../models/timelineModel');
const Content = require('../models/contentModel');
const User = require('../models/userModel');

// Export Timeline Data
router.get('/timelines', auth, async (req, res) => {
    try {
        const timelines = await Timeline.findAll();
        const json = parse(timelines.map(t => t.toJSON()));
        const filePath = path.join(process.cwd(), 'backups', 'timelines.csv');

        fs.writeFileSync(filePath, json);

        res.download(filePath, 'timelines.csv', (err) => {
            if (err) {
                res.status(500).send('Error downloading file');
            }
        });
    } catch (err) {
        res.status(500).json({ message: 'Error exporting timelines', error: err });
    }
});

// Export Content Data
router.get('/contents', auth, async (req, res) => {
    try {
        const contents = await Content.findAll();
        const json = parse(contents.map(t => t.toJSON()));
        const filePath = path.join(process.cwd(), 'backups', 'contents.csv');

        fs.writeFileSync(filePath, json);

        res.download(filePath, 'contents.csv', (err) => {
            if (err) {
                res.status(500).send('Error downloading file');
            }
        });
    } catch (err) {
        res.status(500).json({ message: 'Error exporting contents', error: err });
    }
});

// Export User Data
router.get('/users', auth, async (req, res) => {
    try {
        const users = await User.findAll();
        const json = parse(users.map(t => t.toJSON()));
        const filePath = path.join(process.cwd(), 'backups', 'users.csv');

        fs.writeFileSync(filePath, json);

        res.download(filePath, 'users.csv', (err) => {
            if (err) {
                res.status(500).send('Error downloading file');
            }
        });
    } catch (err) {
        res.status(500).json({ message: 'Error exporting users', error: err });
    }
});

module.exports = router
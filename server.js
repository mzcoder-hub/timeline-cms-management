const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Sequelize, DataTypes } = require('sequelize');
const multer = require('multer');
const path = require('path');

const app = express();
app.use(bodyParser.json());
app.use(cors());

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

// Ensure the uploads directory exists
const fs = require('fs');
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: 'database.sqlite'
});

const Content = sequelize.define('Content', {
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  body: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  timelineId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  deadline: {
    type: DataTypes.DATE,
    allowNull: true
  },
  dueDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  filePath: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  timestamps: true
});

const Timeline = sequelize.define('Timeline', {
  name: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  timestamps: true
});

sequelize.sync();

app.post('/api/timelines', async (req, res) => {
  const timeline = await Timeline.create(req.body);
  res.send(timeline);
});

app.get('/api/timelines', async (req, res) => {
  const timelines = await Timeline.findAll();
  res.send(timelines);
});

app.post('/api/content', upload.single('file'), async (req, res) => {
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

app.get('/api/content/:timelineId', async (req, res) => {
  const content = await Content.findAll({ where: { timelineId: req.params.timelineId } });
  res.send(content);
});

app.get('/api/timelines/overdue', async (req, res) => {
  try {
    const timelines = await Timeline.findAll({
      where: {
        deadline: {
          [Op.lte]: new Date()
        }
      }
    });
    res.json(timelines);
  } catch (error) {
    res.status(204).json({ error: 'Failed to fetch overdue timelines' });
  }
});

app.get('/api/timelines/upcoming', async (req, res) => {
  try {
    const timelines = await Timeline.findAll({
      where: {
        deadline: {
          [Op.gt]: new Date()
        }
      }
    });
    res.json(timelines);
  } catch (error) {
    res.status(204).json({ error: 'Failed to fetch upcoming timelines' });
  }
});

app.listen(5000, () => {
  console.log('Server started on http://localhost:5000');
});

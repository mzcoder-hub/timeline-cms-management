// backend/app.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const timelineRoutes = require('./routes/timeline');
const contentRoutes = require('./routes/content');
const auth = require('./middleware/auth');

const app = express();
app.use(bodyParser.json());
app.use(cors());

app.use('/api/auth', authRoutes);
app.use('/api/timelines', timelineRoutes);
app.use('/api/content', contentRoutes);

app.listen(5000, () => {
  console.log('Server started on http://localhost:5000');
});

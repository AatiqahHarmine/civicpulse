const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const app = express();
app.use(cors({object:"https://civicpulse-green.vercel.app"}));
app.use(express.json({ limit: '10mb' }));

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/issues', require('./routes/issueRoutes'));
app.use('/api/comments', require('./routes/commentRoutes'));
app.use('/api/analytics', require('./routes/analyticsRoutes'));
app.use('/api/notifications', require('./routes/notificationRoutes'));
app.use('/api/profile', require('./routes/profileRoutes'));
app.use('/api/reports', require('./routes/reportRoutes'));

app.get('/', (req, res) => res.json({ message: 'CivicPulse API Running' }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`CivicPulse Engine online on port ${PORT}`));

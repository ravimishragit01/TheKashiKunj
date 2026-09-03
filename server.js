require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');

const app = express();
connectDB();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/rooms', require('./routes/rooms'));
app.use('/api/cabs', require('./routes/cabs'));
app.use('/api/boats', require('./routes/boats'));
app.use('/api/bookings', require('./routes/bookings'));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`The Kashi Kunj server running on http://localhost:${PORT}`));

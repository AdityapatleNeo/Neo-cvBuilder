const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { port, mongoUri } = require('./config.js');
const authRoutes = require('./routes/authRoutes.js');
const resumeRoutes = require("./routes/resumeRoutes.js")
const paymentRoute = require('./routes/payment.js')
const socialLogin = require('./routes/auth.js');
const bodyParser = require('body-parser')
const app = express();
app.use(bodyParser.urlencoded())
app.use(cors({ origin: 'http://localhost:5173' })); 
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/resume', resumeRoutes);
app.use('/api/auth', socialLogin)
app.use('/api/payment',paymentRoute)

mongoose.connect(mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => {
    console.log('MongoDB connected');
    app.listen(port, () => {
      console.log(`Server listening on port ${port}`);
    });
  })
  .catch(err => {
    console.error('DB connection error:', err);
  });

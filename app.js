const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const UserModel = require('./models/user'); // Updated model import
const path = require('path');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public'))); // Serve static files (HTML and CSS)

mongoose.connect('mongodb+srv://kamunwa:30090Sam@cluster0.xm2mttk.mongodb.net/Coders?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Connection Error: '))
db.once('open', function () {
    console.log('Connected successfully  to  Database  SIO!');
});

// Change the root route to serve an HTML file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'signin.html'));
});

app.get('/signup', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'signup.html'));
});

app.post('/signup', (req, res) => {
  const { name, phoneNumber, location } = req.body;
  const newUser = new UserModel({ name, phoneNumber, location });
  
  newUser.save()
    .then(() => {
      res.send('Sign-up successful!');
    })
    .catch((error) => {
      console.error(error);
      res.status(400).send('Sign-up failed. Please try again.');
    });
});

app.post('/signin', async (req, res) => {
  const { phoneNumber } = req.body;

  try {
    const user = await UserModel.findOne({ phoneNumber });

    if (!user) {
      res.status(400).send('Sign-in failed. Please check your phone number.');
    } else {
      console.log(`Sign-in successful for ${user.name}`);
      res.send(`Welcome, ${user.name}`);
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});

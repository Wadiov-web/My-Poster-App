const express = require('express');
const session = require('express-session');
const passport = require('passport');
const mongoose = require('mongoose');
const flash = require('express-flash');
require('dotenv').config();

//console.log(process.env);
const app = express();


// Connect to MongoDB
mongoose.connect('mongodb://localhost/myUsers', {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => {
        console.group('mongodb connected...');
        // app.listen(3000, () => console.log('Server is listening on PORT 3000'));
    }).catch(err => console.log('can not connect to DB', err));

// Set the view engine
app.set('view engine', 'ejs');

// Body parser
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Flash messages
app.use(flash());

// Session initialization
app.use(session({
    secret: process.env.SESSION_SECRET,
    saveUninitialized: false,
    resave: false,
    cookie: {
        maxAge: 60 * 1000 * 60 * 24 * 2
    }
}));

// Importing passport authentication functionalities
require('./config/passport');

// Initializing passport & Configure the session with passport
app.use(passport.initialize());
app.use(passport.session());


//routers
app.use(require('./routes/routers'));


const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server is listening on PORT ${port}`));
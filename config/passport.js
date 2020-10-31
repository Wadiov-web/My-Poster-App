const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');


// Bring in User model
const User = require('../model/user');


const customFields = { usernameField: 'email' };

const verifyCallback = (username, password, done) => {
    User.findOne({ email: username }, async(err, user) => {
        if (err) {
            return done(err);
        }
        if (!user) {
            return done(null, false, { message: 'User not found' });
        }

        const match = await bcrypt.compare(password, user.password);
        if (match) {
            return done(null, user);
        } else {
            return done(null, false, { message: 'Wrong password' })
        }
    });
}

passport.use(new localStrategy(customFields, verifyCallback));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((userId, done) => {
    User.findById(userId, (err, user) => {
        if (err) {
            return done(err);
        }
        done(null, user);
    });
});
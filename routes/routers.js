const express = require('express');
const router = express.Router();
const passport = require('passport');
const bcrypt = require('bcrypt');
const path = require('path');

const multer = require('multer');

// Bring in User model
const User = require('../model/user');


// multer config
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './views/clientSide/uploads');
    },
    filename: function(req, file, cb) {
        cb(null, Date.now() + file.originalname);
    }
});
const upload = multer({ storage: storage });


//-----------------------------------Routers-------------------------------------------

// GET requests

router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/welcomePage.html'));
});

router.get('/login', isAuth, (req, res) => {
    res.render('login');
});

router.get('/register', isAuth, (req, res) => {
    res.render('register');
});

// POST requests
router.post('/login', passport.authenticate('local', {
    successRedirect: '/profile',
    failureRedirect: '/login',
    failureFlash: true
}));

router.post('/register', upload.single('myFile'), (req, res) => {

    const { username, email, password } = req.body;

    let errors = [];

    if (!username || !email || !password) {
        errors.push({ msg: 'Please fill in all fields' });
        console.log('Please fill in all fields');
    }
    if (password.length < 6) {
        console.log('Password must be 6 chars min');
        errors.push({ msg: 'Password must be 6 chars min' });
    }
    if (errors.length > 0) {
        console.log(errors);
        res.render('register', { errors });
    } else {
        console.log('pass');
        console.log(req.file);
        User.findOne({ email: email })
            .then(user => {
                if (user) {
                    console.log('Email is already registered');
                    errors.push({ msg: 'Email is already registered' });
                    res.render('register', { errors });

                } else {
                    console.log(`Email doesn't exists you can register`);

                    bcrypt.genSalt(10, (err, salt) => {
                        if (err) throw err;
                        bcrypt.hash(password, salt, (err, hash) => {
                            if (err) throw err;
                            const newUser = new User({
                                username,
                                email,
                                password: hash,
                                myImage: req.file.filename
                            });
                            console.log(newUser);
                            newUser.save()
                                .then(user => {
                                    res.redirect('/login');
                                })
                                .catch(err => console.log(err));
                        });
                    });
                }
            }).catch(err => console.log('there is an error ' + err));
    }
});


// Profile Route
router.get('/profile', notAuth, (req, res) => {
    console.log(req.session);
    res.sendFile(path.join(__dirname, '../views/clientSide/landingPage.html'));
});

// Logout 
router.post('/logout', (req, res) => {
    req.logOut();
    res.redirect('/login');
});

// Check authentication to protect routes
function notAuth(req, res, next) {
    if (req.isAuthenticated()) {
        next();
    } else {
        res.redirect('/login');
    }
}

function isAuth(req, res, next) {
    if (!req.isAuthenticated()) {
        next();
    } else {
        res.redirect('/profile');
    }
}


//------------------------------------------------- API SETUP ---------------------------------------------------------------------------------


// Send JSON data of the logged in user
router.get('/user/data', notAuth, (req, res) => {
    res.status(200).json(req.user);
});

router.use(express.static(path.join(__dirname, '../views/clientSide')));

//----------------------- POSTING POSTS ---------------------------------------------------------------------------

router.post('/user/posts', notAuth, (req, res) => {

    User.findOne({ username: req.user.username })
        .then(user => {
            const txt = {
                text: req.body.text
            }
            user.posts.push(txt);
            user.save().then(result => {
                res.status(200).json({ posts: result.posts });
            }).catch(err => {
                console.log(err);
                res.status(500).json({ error: err });
            });
        }).catch(err => {
            console.log('can not find user' + err);
            res.status(500).json({ error: err });
        });
});

// ----------------------------- POSTING COMMENTS ----------------------------------------------
router.post('/user/posts/comments', notAuth, (req, res) => {

    User.findOne({ username: req.body.cmtReceiver })
        .then(user => {

            const myPost = user.posts.find(post => post._id == req.body.postId);
            const commentar = {
                cmt: req.body.commentVal,
                provider: req.body.cmtProvider,
                providerImg: req.body.providerImg
            }
            myPost.comments.push(commentar);

            user.save().then(userUpdt => {
                //const extPost = userUpdt.posts.find(post => post._id == req.body.postId)
                res.json({ exctPost: myPost });
            }).catch(err => {
                console.log(err);
                res.status(500).json({ error: err });
            });
        }).catch(err => {
            console.log(err);
            res.status(500).json({ error: err });
        });
});

//------------------------------ GET COMMENTS WHEN YOU CLICK ON WITH ID------------------------------------

router.post('/user/posts/get-comments', notAuth, (req, res) => {
    User.findOne({ username: req.body.username }).then(user => {

        const postFound = user.posts.find(post => post._id == req.body.postId);
        res.json({ result: postFound.comments });
    }).catch(err => console.log(err));
});


//----------------------------- GET ALL POSTS OF ALL USERS -------------------------------------------
router.get('/all-users/posts', notAuth, (req, res) => {

    User.find()
        .then(users => {
            //console.log(users);
            res.status(200).json({ users: users });
        }).catch(err => {
            console.log(err);
            res.status(500).json({ error: err });
        });
});


//------------------------------------- UPDATING POSTS ----------------------------------------------

router.put('/user/posts/update-one', notAuth, (req, res) => {

    // console.log(req.body);
    User.findOne({ username: req.user.username })
        .then(user => {

            const found = user.posts.find(post => post._id == req.body.postId);
            found.text = req.body.updated;
            user.save().then(updated => {
                res.status(200).json({ posts: updated.posts });
            }).catch(err => console.log(err));

        }).catch(err => console.log(err));
});




//------------------------------------- DELETE POSTS -----------------------------------------------------------

router.delete('/user/posts/delete-one', notAuth, (req, res) => {

    //console.log(req.body);
    User.findOne({ username: req.user.username })
        .then(user => {
            const targetPost = user.posts.filter(post => post._id != req.body.postId);
            user.posts = targetPost;
            user.save().then(result => {
                res.status(200).json({ delPosts: user.posts });
            });
        }).catch(err => console.log(err));
});



// -------------------------------- SEARCH REQUESTS ---------------------------------------------------------------
router.post('/search-users', notAuth, (req, res) => {

    User.find({
            $text: {
                $search: req.body.myuser
            }
        })
        .then(user => {
            if (user.length !== 0) {
                user.forEach(elmt => {
                    console.log(elmt.username);
                    res.json({ msg: elmt.username, img: elmt.myImage });
                });
            } else {
                res.json({ msg: 'no result' });
                console.log('no user');
            }
        }).catch(err => console.log(err));
});


//--------------------------------------------- GET VISITED USER------------------------------------------------
router.post('/get-visited-user/data', notAuth, (req, res) => {
    User.findOne({ username: req.body.text })
        .then(user => {
            res.status(200).json({ user: user });
        }).catch(err => console.log(err));
});

//---------------------------------------------- ACCOUNT UPDATES -----------------------------------------------------

// Update username 
router.post('/user/update-username', notAuth, (req, res) => {

    User.findOne({ username: req.user.username })
        .then(user => {

            user.username = req.body.newUsername;
            user.save().then(doc => {
                req.logOut();
                //res.status(200).json({ msg: 'username updated' });
                res.redirect('/login');
            }).catch(err => {
                console.log(err);
                res.status(500).json({ error: err });
            });

        }).catch(err => {
            console.log(err);
            res.status(500).json({ error: err });
        });
});

// Delete account
router.get('/user/delete-account', notAuth, (req, res) => {

    User.deleteOne({ username: req.user.username })
        .then(result => {
            console.log('deleeted');
            res.redirect('/login');
        }).catch(err => {
            res.status(500).json({ error: err });
        });
});


//------------------------------------ 404 PAGE --------------------------------------------------------------

router.use(function(req, res) {
    res.sendFile(path.join(__dirname, '../views/404.html'));
});


module.exports = router;
// This module handles the 'users' controll functions
// <--- Modules --->
const User = require('mongoose').model('User'); // User model
const bcrypt = require('bcrypt') // imports bcrypt module

// <--- Variables --->
// Date formatting for birthday
const options = {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
}

// <--- Controller Functions --->
module.exports = {
    index: (req, res) => {
        res.render('index');
    },
    show: (req, res) => {
        // validates session
        if (!req.session.email) {
            res.redirect('/');
        } else {
        // Queries DB for the user with the matching ID
        res.render('users', {user: req.session})
        }
    },
    create: (req, res) => {
        bcrypt.hash(req.body.password, 10) // using bcrypt to hash pw with 10 rounds of salt
            .then(hashed_password => {
                const user = new User(); // creates new user, manually assigns values due to PW hasing
                user.first_name = req.body.first_name;
                user.last_name = req.body.last_name;
                user.email = req.body.email;
                user.password = hashed_password;
                user.birthday = req.body.birthday;

                user.save() // save user to DB / create session data, then redirect to logged in page
                    .then( () =>{
                        req.session.email = user.email;
                        req.session.first_name = user.first_name;
                        req.session.last_name = user.last_name;
                        req.session.birthday = user.birthday.toLocaleDateString("en-US", options);

                        res.redirect('/users/show');
                    })
                    .catch(err => {
                        for (var key in err.errors) {
                            req.flash('registrationErrors', err.errors[key].message); // add error to registrationErrors
                        }
                        res.redirect('/');
                    });
            })
            .catch(err => console.log(err));
    },
    login: (req, res) => {
        User.findOne({email: req.body.email}) // query DB for email
            .then(data => {
                bcrypt.compare(req.body.password, data.password) // compares form pw to db pw using bcrypt.
                    .then( result => {
                        if(result) { // brcrypt returns boolean, so you need an if statement, rather than a promise
                            // creates session
                            req.session.email = data.email;
                            req.session.first_name = data.first_name;
                            req.session.last_name = data.last_name;
                            req.session.birthday = data.birthday.toLocaleDateString("en-US", options);

                            res.redirect('/users/show'); // redirect to login w/ session data
                        } else {
                            req.flash('loginErrors', "Invalid username or password"); // on invalid password displays errors
                            res.redirect('/');
                        }
                    })
                    .catch(err => console.log(err)); // displays dev errors
            })
            .catch(result => {
                console.log(result); // displays errors on invalid username
                req.flash('loginErrors', "Invalid username or password");
                res.redirect('/');
            });
    },
    logout: (req, res) => {
        req.session.destroy();
        res.redirect('/');
    }
}
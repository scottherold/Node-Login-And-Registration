// <--- Modules --->
const express = require('express'); // imports express module
const session = require('express-session')// imports session module
const flash = require('express-flash'); // imports flash module

// <--- Server Constructors --->
const port = process.env.port || 8000; // establishes port
const app = express(); // constructs express server

// <--- Server Settings --->
app.set('view engine', 'ejs'); // sets templating engine to ejs
app.set('views', __dirname + '/client/views'); // maps view dir
app.use(express.urlencoded({extended: true})); // allows POST routes
// ** Session Settings ***
app.set('trust proxy', 1); // trust first proxy
app.use(session({
    secret: 'logAuthSecKey',
    resave: false,
    saveUninitialized: true,
    cookie: {maxAge: 60000}
}));
app.use(flash()); // flash messages

// <--- Database & Routing --->
require(__dirname + '/server/config/database'); // DB Connection
require(__dirname + '/server/config/routes')(app); // Routing

// <--- Port Listening --->
app.listen(port, () => console.log(`Express server listening on port ${ port }`)); // note on listen

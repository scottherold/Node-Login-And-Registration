// This mopdule contructs the database connection
const mongoose = require('mongoose'); // imports mongoose for server connection
const fs = require('fs'); // file-system so to load, read and require all model files
const path = require('path'); // utilizes path for easy dir/file joining
const modelsPath = path.resolve('server', 'models'); // Dir where models are located
const reg = new RegExp('\\.js$', 'i'); // REGEX for JavaScrip files
const db = 'mongodb://localhost/login-and-registration'; // URL for DB connection

// <--- DB Settings --->
mongoose.connect(db, {useNewUrlParser: true}); // connect to the DB
mongoose.Promise = global.Promise; // overrides mongoose promises with express promises

// <--- DB Connection Events --->
// ** Successful Connection **
mongoose.connection.on('connected', () => {
    console.log(`Mongoose default connection open to ${ db }`);
});

// ** Error on Connection **
mongoose.connection.on('error', err => {
    console.error(`Mongoose default connection error: ${ err }`);
    process.exit(0); // kills DB connection
});

// ** Connection Disconnect **
mongoose.connection.on('disconnected', () => {
    console.log('Mongoose default connection disconnected');
});

// ** Node process end => Mongoose disconnect **
process.on('SIGINT', () => {
    mongoose.connection.close( () => {
        console.log('Mongoose default connection disconnected through program termination');
        process.exit(0); // kills DB connection
    });
});

// <--- Model Connection --->
// iterate through all .js files in the model path (/server/models/..) and require
fs.readdirSync(modelsPath).forEach(file => {
    // REGEX file for .js extension
    if(reg.test(file)) {
        require(path.join(modelsPath, file)); // require file (model)
    }
})
// This module handles routing
// <--- Modules --->
const usersController = require('../controllers/users'); // imports the users controller

// <--- Routing --->
module.exports = app => {
    app.get('/', usersController.index); // GET -- root
    app.get('/users/show', usersController.show); // GET -- show single user
    app.post('/users', usersController.create); // POST - new user
    app.post('/users/login', usersController.login); // POST - login user
    app.get('/users/logout', usersController.logout); // GET -- logout user
}
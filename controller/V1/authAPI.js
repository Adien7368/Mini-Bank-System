const { _ } = require('lodash')
const error = require('restify-errors')
const { signUpValidation, logInValidation } = require('../../utility/validation')
const { pool } = require('../../db/db_init')


function signUp(req, res, next) {
    var name = _.trim(req.body.name);
    var username = _.trim(req.body.username);
    var email = _.trim(req.body.email);
    var password = _.trim(req.body.password);
    var phone = _.trim(req.body.phone);
    console.log(req.body);
    signUpValidation(name, phone, username, email, password).then(() => {
        return next({code: 'success', message: 'User Created'});
    }).catch(err => {
        return next(new error.InternalServerError());
    });
}   


function verify(req, res, next) {
    
}

function login(req, res, next){
    var email = _.trim(req.body.email);
    var password = _.trim(req.body.password);
    logInValidation(email, password).then(() => {
        return next({code: 'success', message: 'Logged in'})
    }).catch(err => {
        console.log(err);
        return next(new error.UnauthorizedError());
    })

}

function logout(req, res, next){
    
}

function resetPassword(req, res, next){
    var email = _.trim(req.body.email);
}

function updatePassword(req, res, next){
    
}



module.exports = {signUp, verify, login};
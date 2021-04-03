const { _ } = require('lodash')
const error = require('restify-errors')
const { signUpValidation } = require('../../utility/validation')
const { pool } = require('../../db/db_init')


function signUp(req, res, next) {
    var name = _.trim(req.body.name);
    var username = _.trim(req.body.username);
    var email = _.trim(req.body.email);
    var password = _.trim(req.body.password);
    var phone = _.trim(req.body.phone);
    console.log(req.body);
    signUpValidation(name, phone, username, email, password).then(obj => {
        console.log(obj)
        return next({code: 'success', message: ''});
    }).catch(err => {
        return next({code: '400', message: ''});
    });
}   


function login(req, res, next){
    var email = _.trim(req.body.email);
    var password = _.trim(req.body.passsword);

}

function logout(req, res, next){
    
}

function resetPassword(req, res, next){
    var email = _.trim(req.body.email);
}

function updatePassword(req, res, next){
    
}



module.exports = {signUp};
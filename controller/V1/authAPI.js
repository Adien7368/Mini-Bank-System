const { _ } = require('lodash')
const error = require('restify-errors')
const { signUpValidation, logInCheck, transactionValidate, updateTransaction, createUserAndAccount, getHistoryJson, validateAccountId, verifyUserId, addToVerificationQueue} = require('../../utility/validation')
const { pool } = require('../../db/db_init')


function signUp(req, res, next) {
    var name = _.trim(req.body.name);
    var username = _.trim(req.body.username);
    var email = _.trim(req.body.email);
    var password = _.trim(req.body.password);
    var phone = _.trim(req.body.phone);
    signUpValidation(name, phone, username, email, password).then(obj => {
        if(obj.valid){
            createUserAndAccount(name,phone,username,email,obj.hash)
            .then(obj1 => next(obj1))
            .catch(err => {
                console.log(err);
                return next(new error.BadRequestError());
            });
        } else {
            console.log(obj);
            return next(new error.BadRequestError());
        }
    }).catch(err => {
        console.log(err);
        return next(new error.InternalServerError());
    });
}   


function verify(req, res, next) {
    let email = _.trim(req.body.email);
    verifyUserId(email)
    .then(res => {
        if(res.valid){
            addToVerificationQueue(email);
            return next({code: 'success', message: 'Verification triggered'});
        }
    })
    .catch(err => {
        console.log(err);
        return next(new error.BadRequestError());
    })

}

function login(req, res, next){
    var email = _.trim(req.body.email);
    var password = _.trim(req.body.password);
    logInCheck(email, password)
    .then(obj => next(obj))
    .catch(err => {
        console.log(err);
        return next(new error.UnauthorizedError());
    })

}

function handleTransaction(req, res, next){
    var toAccId = _.trim(req.body.toAccountId);
    var fromAccId = _.trim(req.body.fromAccountId);
    var balance = _.trim(req.body.balance);
    transactionValidate(fromAccId, toAccId, balance).then(validation => {
        if(validation.valid){
            updateTransaction(fromAccId, toAccId, balance)
            .then((obj) => {
                return next(obj);
            })
            .catch(err => next(new error.BadRequestError()));
        } 
    }).catch(err => {
        return next(new error.BadRequestError());
    })

}


function transactionHistory(req, res, next){
    var id = _.trim(req.body.id);
    validateAccountId(id)
    .then(obj => {
        if(obj.valid){
            getHistoryJson(id)
            .then(obj => {
                return next(obj);
            })
            .catch(err => {
                console.log(err);
                return next(new error.BadRequestError())
            });
        } else {
            return next(new error.BadRequestError());
        }
    })
    .catch(err => {
        console.log(err);
        return next(new error.BadRequestError())
    });
}



module.exports = {signUp, verify, login, handleTransaction, transactionHistory};
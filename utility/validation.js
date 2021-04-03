const { _ } = require('lodash');
const bcrypt = require('bcrypt');
const { pool } = require('../db/db_init.js');
const { isEmailValid } = require('./utils');
const { secret } = require('../jwtconfig')
const jwt = require('jsonwebtoken')

async function signUpValidation(name, phone, username, email, password){
    var status = { };
    if(!name){
        status = {valid: false, errorMessage: "Name is missing"}
        return Promise.reject(status);
    } else if(!phone){
        status = {valid: false, errorMessage: "Phone no. is missing"}
        return Promise.reject(status);
    } else if(!username){
        status = {valid: false, errorMessage: "Username is missing"}
        return Promise.reject(status);
    } else if(!email){
        status = {valid: false, errorMessage: "email is missing"}
        return Promise.reject(status);
    } else if(!password){
        status = {valid: false, errorMessage: "passoword is missing"}
        return Promise.reject(status);
    }

    if(isEmailValid(email)){
        return pool.query(`select * from users where customer_email=$1`, [email]).then(res => {
            if(res.rowCount == 0){
                return bcrypt.hash(password, 10)
                    .then((hash) => Promise.resolve({valid: true, errorMessage: "", hash: hash}))
                    .catch(err => Promise.reject({valid: false, errorMessage: "User password is in wrong format"}));
            } else {
                status = {valid: false, errorMessage: "User already exits"};
                return Promise.reject(status);  
            }
        }).catch(err => Promise.reject(err));
    } else {
        status = {valid: false, errorMessage: "Email is not valid"}
        return Promise.reject(status);
    }
}


async function createUserAndAccount (name, phone, username, email, password) {
    return pool.query(`insert into users (user_name, user_phone, customer_email, username, security_pass, created_date) values ($1,$2,$3,$4,$5,$6)`,[name,phone,email,username,password, new Date()]).then(() => {
        return pool.query('select user_id from users where customer_email=$1 limit 1',[email]).then(res => {
            return pool.query('insert into Accounts (account_name, created_date, other_details, account_type, verification, user_id) values ($1,$2,$3,$4,$5,$6)', 
                    [name, new Date(), '', 'SAVING', 'PENDING', res.rows[0].user_id])
                    .then(() => Promise.resolve({code: 'success', message: 'User is created'}))
                    .catch(err => {
                        pool.query('delete from users where customer_email=$1',[email]);
                        return Promise.reject(err);
                    });
        }).catch(err => {
            pool.query('delete from users where customer_email=$1',[email]);
            return Promise.reject(err);
        })
    }).catch((err) => {
        return Promise.reject(err);
    })
}

async function logInCheck(email, password) {
    var status = { };
    if(!password){
        status = {valid: false, errorMessage: "Password is empty"}
        return Promise.reject(status);
    } else if(!email){
        status = {valid: false, errorMessage: "email is empty"}
        return Promise.reject(status);
    } 

    if(isEmailValid(email)) {
        return pool.query('select * from users where customer_email=$1',[email]).then((res) => {
            if(res.rowCount > 0) {
                var match =  bcrypt.compareSync(password, res.rows[0].security_pass);
                if(match){
                    const token = jwt.sign({ sub: res.rows[0].user_id }, secret, { expiresIn: '1h' });
                    return Promise.resolve({code: 'success', message: 'Logged In!', token: token});
                } else {
                    status = {valid: false, errorMessage: "Password is worng"}
                    return Promise.reject(status);
                }
            } else {
                status = {valid: false, errorMessage: 'no user with this email'}
                return Promise.reject(status);
            }
            }).catch(err => {
                return Promise.reject(err);
            });
    } else {
        status = {valid: false, errorMessage: "Email is not valid"}
        return Promise.reject(status);
    }
}


async function transactionValidate(fromAccId, toAccId, balance){
    var status = {}
    if(!fromAccId){
        status = {valid: false, errorMessage: ""}
        return Promise.reject(status);
    } else if(!toAccId){
        status = {valid: false, errorMessage: ""}
        return Promise.reject(status);
    } else if(!balance){
        status = {valid: false, errorMessage: ""}
        return Promise.reject(status);
    } else if (fromAccId == toAccId) {
        status = {valid: false, errorMessage: ""}
        return Promise.reject(status);
    }

    return pool.query('select * from accounts where account_id=$1',[fromAccId])
            .then((res) => {
                if(res.rows.length > 0 && res.rows[0].balance >= balance) {
                    return pool.query('select * from accounts where account_id=$1',[toAccId])
                            .then(res => res.rows.length > 0 ? Promise.resolve({valid: true}):Promise.reject({valid: false, errorMessage: "Account not present"}))
                            .catch(err => Promise.reject({valid: false, errorMessage: "Account not present"}))
                } else {
                    status = {valid: false, errorMessage: 'Insufficient balance or Account not there'};
                    return Promise.reject(status);
                }
            })
            .catch(err => {
                console.log(err);
                status = {valid: false, errorMessage: ''};
                return Promise.reject(status);
            });
}

async function updateTransaction(fromAccId, toAccId, balance) {

    return pool.query('updateusers set  accounts set balance = balance - $1 where account_id=$2',[balance,fromAccId])
        .then(() => {
            return pool.query('update accounts set balance = balance + $1 where account_id=$2',[balance,toAccId])
                    .then(() => {
                        return pool.query('insert into transactions (amount, fromAccount, toAccount, createdTime) values ($1, $2, $3, $4)',[balance, fromAccId, toAccId, new Date()])
                                .then (() => Promise.resolve({code:'success', meesage: 'Transacetion successful'}))
                                .catch (err => {
                                    pool.query('update accounts set balance = balance - $1 where account_id=$2',[balance,toAccId]);
                                    pool.query('update accounts set balance = balance + $1 where account_id=$2',[balance,fromAccId]);
                                    return Promise.reject();
                                })
                    })
                    .catch(err => {
                        pool.query('update accounts set balance = balance + $1 where account_id=$2',[balance,fromAccId]);
                        return Promise.reject();
                    });
        })
        .catch(err => Promise.reject(err))

}


async function validateAccountId(id){
    var status = {}
    if(!id){
        status = {valid: false, errorMessage: ""}
        return Promise.reject(status);
    }

    return pool.query('select * from accounts where account_id=$1',[id])
    .then(obj => {
        if(obj.rowCount > 0){
            return Promise.resolve({valid: true, errorMessage: ""});
        } else {
            return Promise.reject({valid: false, errorMessage: "No Account with this is id"});
        }
    })
    .catch(err => Promise.reject({valid: false, errorMessage: 'Error in querying', error: err}));

}

async function getHistoryJson(userid) {
    return pool.query('select account_id from accounts where user_id=$1 limit 1',[userid]).then(res => {
        if (res.rowCount > 0){
            return pool.query('select amount,fromAccount,toAccount,createdTime from transactions where fromAccount=$1 or toAccount=$1',[res.rows[0].account_id])
            .then(res => {
                return Promise.resolve({code:'success', values: res.rows});
            })
            .catch(err => Promise.reject(err));
        } else {
            return Promise.reject({errorMessage: "No account for a user Id"});
        }
    })
    .catch(err => Promise.reject(err));
    
}

async function validateUserId(email) {
    var status = {}
    if(!email){
        status = {valid: false, errorMessage: ""}
        return Promise.reject(status);
    }
    return pool.query('select * from users where customer_email=$1 limit 1',[email])
            .then(res => {
                if(res.rowCount > 0)
                    return Promise.resolve({valid:true, errorMessage: "", user_id: res.rows[0].user_id});
                else 
                    return Promise.reject({valid: false, errorMessage: "user id does not exits"})
            })
            .catch(err => Promise.reject(err));
}

function addToVerificationQueue(email){
    pool.query('select user_id from users where customer_email=$1 limit 1',[email])
    .then(res => {
        pool.query('update accounts set verification = $1 where user_id = $2', ['SUCCESS',res.rows[0].user_id]);
    })
}


module.exports = { signUpValidation, logInCheck , transactionValidate, updateTransaction, createUserAndAccount, getHistoryJson, validateAccountId, validateUserId, addToVerificationQueue};
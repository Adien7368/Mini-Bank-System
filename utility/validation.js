const { _ } = require('lodash');
const bcrypt = require('bcrypt');
const { pool } = require('../db/db_init.js');
const { isEmailValid } = require('./utils')

async function signUpValidation(name, phone, username, email, password){
    var status = { };
    if(!name){
        status = {valid: false, errorMessage: ""}
        return Promise.reject(status);
    } else if(!phone){
        status = {valid: false, errorMessage: ""}
        return Promise.reject(status);
    } else if(!username){
        status = {valid: false, errorMessage: ""}
        return Promise.reject(status);
    } else if(!email){
        status = {valid: false, errorMessage: ""}
        return Promise.reject(status);
    } else if(!password){
        status = {valid: false, errorMessage: ""}
        return Promise.reject(status);
    }

    if(isEmailValid(email)){
        try {
            return pool.query(`select * from users where customer_email=$1`, [email]).then(res => {
                if(res.rowCount == 0){
                    return bcrypt.hash(password, 10)
                            .then((hash) => createUserAndAccount(name, phone, username, email, hash))
                            .catch(err => Promise.reject({valid: false, errorMessage: "User password is in wrong format"}));
                } else {
                    status = {valid: false, errorMessage: "User already exits"};
                    return Promise.reject(status);  
                }
            }).catch(err => {
                status = {valid: false, errorMessage: "Internal server error"};
                return Promise.reject(status);   
            });
        } catch (e){
            console.log("Exception", e);
            status = {valid: false, errorMessage: "Internal server error"}
            return Promise.reject(status);
        }
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
                    .then(() => Promise.resolve())
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

async function logInValidation(email, password) {
    var status = { };
    if(!password){
        status = {valid: false, errorMessage: ""}
        return Promise.reject(status);
    } else if(!email){
        status = {valid: false, errorMessage: ""}
        return Promise.reject(status);
    } 

    if(isEmailValid(email)) {
        return pool.query('select * from users where customer_email=$1',[email]).then((res) => {
            var match =  bcrypt.compareSync(password, res.rows[0].security_pass);
            if(match){
                return Promise.resolve();
            } else {
                status = {valid: false, errorMessage: "Email is not valid"}
                return Promise.reject(status);
            }
            
            }).catch(err => {
                status = {valid: false, errorMessage: "user does not exits"}
                return Promise.reject(status);
            });
    } else {
        status = {valid: false, errorMessage: "Email is not valid"}
        return Promise.reject(status);
    }
}



module.exports = { signUpValidation, logInValidation };
const { _ } = require('lodash');
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
                    return createUserAndAccount(name, phone, username, email, password);
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
    pool.query(`insert into users (user_name, user_phone, customer_email, username, security_pass, created_date) values ($1,$2,$3,$4,$5,$6)`,[name,phone,email,username,password, new Date()]).then(() => {
        return Promise.resolve();
    }).catch((err) => {
        return Promise.reject(err);
    })
}



module.exports = { signUpValidation };
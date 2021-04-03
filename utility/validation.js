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
            pool.query(`select * from users where customer_email=$1`, [email], (err, res) => {
                if(err) {
                    console.log("Error Query ", err);
                    status = {valid: false, errorMessage: ""};
                    return Promise.reject(status);
                }

                if(res.rowCount == 0){
                    // createUserAndAccount(name, phone, username, email, password).then((obj) => {
                    //     console.log("Created User", obj);
                    //     status = {valid: true, errorMessage: ""};
                    //     return Promise.resolve(status);
                    // }).catch((err) => {
                    //     console.log("Error in user creation", err);
                    //     status = {valid: false, errorMessage: ""};
                    //     return Promise.reject(status);
                    // })
                } else {
                    status = {valid: false, errorMessage: ""};
                    return Promise.reject('status');
                }
                
            })
        } catch (e){
            console.log("Sign up.. error.. ", e);
            status = {valid: false, errorMessage: ""}
            return Promise.reject(status);
        }
    } else {
        status = {valid: false, errorMessage: ""}
        return Promise.reject(status);
    }
}


async function createUserAndAccount (name, phone, username, email, password) {
    pool.query(`insert into users (user_name, user_phone, customer_email, username, security_pass, created_date) values ($1,$2,$3,$4,$5,$6)`,[name,phone,email,username,password, new Date()]).then((res) => {
        return Promise.resolve(res);
    }).catch((err) => {
        return Promise.reject(err);
    })
}



module.exports = { signUpValidation };
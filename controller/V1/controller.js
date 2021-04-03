const { _, forEach } = require('lodash')
const error = require('restify-errors')
const { signUpValidation, logInCheck, transactionValidate, updateTransaction, createUserAndAccount, getHistoryJson, validateAccountId, validateUserId, addToVerificationQueue} = require('../../utility/validation')
const { pool } = require('../../db/db_init')
const { v4: uuidv4 } = require('uuid');
const html_to_pdf = require('html-pdf-node');
const fs = require('fs');
const nodemailer = require('nodemailer');


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
    validateUserId(email)
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
    var email = _.trim(req.body.email);
    validateUserId(email)
    .then(obj => {
        if(obj.valid){
            getHistoryJson(obj.user_id)
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

function generatePDF(req, res, next) {
    var email = _.trim(req.body.email);
    validateUserId(email)
    .then(obj => {
        if(obj.valid){
            getHistoryJson(obj.user_id)
            .then(obj => {
                var fileName = uuidv4()+".pdf";
                html_to_pdf.generatePdf({content: toHtml(obj)}, {format: 'A4'}).then()
                .then(pdfBuffer => {
                    fs.writeFile('pdfFiles/' + fileName, pdfBuffer, (res) => {
                        const transporter = nodemailer.createTransport({
                            host: 'smtp.ethereal.email',
                            port: 587,
                            auth: {
                                user: 'ed.green@ethereal.email',
                                pass: 'zhu7CWaWAkU8XpK9Bj'
                            }
                        });
                        var mailOptions = {
                            from: 'ed.green@ethereal.email',
                            to:   email,
                            subject: "Your bank statement",
                            text: "There is pdf attachment",
                            attachments: [
                                {
                                    fileName: fileName,
                                    path: './pdfFiles/'+fileName
                                }
                            ]
                        };
                          transporter.sendMail(mailOptions, function(error, info){
                            if(error){
                                console.log(error);
                            } else {
                                console.log(info.response)
                            }
                          });
                    });
                })
                return next({code: 'success', link: '/genpdf/'+fileName})
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

function toHtml(obj){
    var html = '<table>';
    if (obj.values.length > 0){
        html += '<tr>';
        for (var key in obj.values[0]){html += '<th>'+key+'</th>';}
        html += '</tr>';
    }

    for (var j = 0; j< obj.values.length; ++j){
        html += '<tr>';
        for (var key in obj.values[j]){html += '<th>'+obj.values[j][key]+'</th>';}
        html += '</tr>';
    };
    html += '</table>';
    return html;
}

function handleFileRequest(req, res, next){
    var filename = req.params.filename;
    res.contentType("application/pdf");
    res.sendFile(filename, {root: './pdfFiles'});
}

module.exports = {signUp, verify, login, handleTransaction, transactionHistory, generatePDF, handleFileRequest};
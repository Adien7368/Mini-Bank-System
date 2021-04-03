const express = require('express');
const error = require('restify-errors');
const jwt = require('jsonwebtoken');
const { signUp, verify, login, handleTransaction, transactionHistory, generatePDF, handleFileRequest } = require('../../controller/V1/controller');
const { secret } = require('../../jwtconfig');

var router = express.Router();

router.post( '/login'     , login);
router.post( '/register'   , signUp);

router.use(function(req, res, next) {
    if('authorization' in req.headers){
        jwt.verify(req.headers['authorization'], secret, (err, decoded) => {
            if(err){
                return res.send(new error.UnauthorizedError());
            } 
            res.user_id = decoded.sub;
            return next();
        })
    } else {
        res.send(new error.UnauthorizedError());
    }
});

router.post( '/verification', verify);
router.post( '/transaction', handleTransaction);
router.get( '/history'   , transactionHistory);
router.get( '/hitoryPDF', generatePDF);
router.get( '/genpdf/:filename', handleFileRequest);



module.exports = { router };
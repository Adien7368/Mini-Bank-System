const express = require('express');
const { authControllers, featureController } = require('../../controller/V1/mainCont');

var routerv1 = express.Router();

authControllers(routerv1);

routerv1.use(function(req, res, next) {
    
    next();
});

featureController(routerv1);

module.exports = { routerv1 };
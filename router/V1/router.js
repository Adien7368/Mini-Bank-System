const express = require('express');
const { authControllers, featureController } = require('../../controller/V1/mainCont');

var routerv1 = express.Router();

authControllers(routerv1);
featureController(routerv1);

module.exports = { routerv1 };
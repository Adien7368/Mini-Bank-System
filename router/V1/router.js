const express = require('express');
const { authControllers } = require('../../controller/V1/mainCont');

var routerv1 = express.Router();

authControllers(routerv1);

module.exports = { routerv1 };
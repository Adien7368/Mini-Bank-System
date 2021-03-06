const express  = require('express');
const bodyParser = require('body-parser');
const { router } = require('./router/V1/router')

var app = express();
app.use(express.static('pdfFiles'));

app.use(function (req, res, next) {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Headers', '*');
	res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
	res.header('Content-Type', 'application/json');
	next();
});

// To parse URLEncoded data
app.use(bodyParser.urlencoded({ extended : true }));
// To parse Json data
app.use(bodyParser.json());

app.use("/api/v1", router);


app.use(function (obj, req, res, next)  {
	console.log("Response Object", obj);
	res.send(obj);
});


app.listen(8080);

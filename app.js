import express from 'express'
import bodyParser from 'body-parser';

var app = express();
app.use(function (req, res, next) {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Headers', '*');
	res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
	res.header('Content-Type', 'application/json');
	next();
});

// To parse URLEncoded data
app.use(bodyParser.urlencoded({ extended : false }));
// To parse Json data
app.use(bodyParser.json());




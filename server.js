var path = require('path');

var express = require('express');

var app = express();

var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());

app.use(express.static(path.join(__dirname, './client')));

require('./config/mongoose');

require('./config/routes')(app);

app.listen(8000, function() {
	console.log("listening on 8000");
})
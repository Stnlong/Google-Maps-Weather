var weather = require('../controllers/weather');
var mongoose = require('mongoose');
var fs = require('fs');

module.exports = function(app) {
	app.post('/updateWeather', function(req, res) {
		console.log("Adding new weather data to the db");
		weather.updateWeather(req, res);
		
	})
	app.get('/getWeatherDB', function(req, res) {
		weather.retrieveData(req, res);
	})
}
var mongoose = require('mongoose');

var fs = require('fs');

var path = require('path');

mongoose.connect('mongodb://localhost/Weather');

var models_path = path.join(__dirname, './../models');

fs.readdirSync(models_path).forEach(function(file) {
	if(file.indexOf('.js') >= 0) {
		// require all of the js files -- remember that require RUNS the code even if there is no module.exports in the file
		require(models_path + '/' + file);
	}
})
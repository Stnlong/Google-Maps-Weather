var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var weatherSchema = mongoose.Schema({
	lat: Number,
	lon: Number,
	id: Number,
	city: String,
	sunrise: Number,
	sunset: Number,
	description: String,
	temperature: Number,
	updated_at: {type: Date, default: new Date}
});

mongoose.model('Weather', weatherSchema);
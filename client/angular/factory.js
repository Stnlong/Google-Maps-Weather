appModule.factory('weatherFactory', function($http) {
	var weather = [];
	var factory = {};

	factory.getWeatherData = function (callback) {
		$http.get('/getWeatherDB').success(function(output) {
			weather = output;
			callback(weather);
		})
	}
	return factory
})


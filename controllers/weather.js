var fs = require('fs');
var mongoose = require('mongoose');
var Weather = mongoose.model("Weather");
var weather = {};
var http = require('http');

// List of City IDs that OpenWeatheMap uses. 
var cities = [
			[5128581, 5368361, 4887398, 4699066, 4560349, 5308655, 4726206, 5391811, 4684888, 5392171],
			[4254010, 4259418, 4116315, 5391959, 4188985, 4460243, 4691930, 4990729, 5520993, 4641239],
			[5809844, 4463523, 4880731, 4930956, 4644585, 4347778, 4544349, 4299276, 4720131, 5506956],
			[5263045, 5454711, 5318313, 4692400, 5389489, 5125086, 4273837, 5304391, 4791259, 4180439],
			[5417598, 5074472, 4487042, 4164138, 5378538, 5037649, 4553433, 4188377, 4281730, 4671240],
			[4335045, 5325738, 4174757, 5856195, 4883817, 5323810, 5392900, 4407066, 4522586, 4683416],
			[4297983, 5206379, 5879400, 5399020, 4508722, 5045360, 5174035, 4469146, 4143861, 4719457],
			[4294494, 5072006, 5819881, 5099836, 5336899, 4920423, 4167147, 4171563, 4680369, 4705349],
			[4776222, 4464368, 5229526, 5525577, 5359777, 4499612, 5295985, 4693003, 4158476, 5511077],
			[4752186, 5295903, 4315588, 4700168, 5313457, 5509403, 4920512, 5586437, 4263681, 5391710]
			];


// Loops through the cities array and makes an API request for each array element. Once that is done call the method to update the database with the new data.
function getNewWeather() {
	Weather.remove({}, function(err) { 
	   console.log('collection removed') 
	});
	for(var i = 0; i < cities.length; i++) {
		http.get('http://api.openweathermap.org/data/2.5/group?id='+cities[i].toString()+'&units=imperial', function(response) {
			console.log("Got response: " + response.statusCode);
			var body = '';
			response.on('data', function(d) {
			    body += d;
			});
			response.on('end', function() {
				// Data reception is done, do stuff with it!
				var parsed = JSON.parse(body);
				// console.log(parsed);
				weather.updateDB(parsed);
			});
			response.on('timeout', function() {
				console.log('error');
			});
			response.on('error', function(e) {
				console.log("Got error: " + e.message);
			});
		}).setTimeout(2000,function(){
			console.log("Timed Out!");
			this.end(); 
		});
	}
}   

// Calls the function to request new API data every 30 minutes.
function checkMinute() {
	var date = new Date;
	var minute = date.getMinutes();
	if (minute == 0 || minute ==30) {
		console.log("Time to update");
		getNewWeather();
		console.log("Done updating the weather");
	}
	else {
		console.log("Minute is: " + minute + ". It's not time yet.");
	}
}
// getNewWeather();
// Saves new weather API data into the database
weather.updateDB = function (req, res) {
	for(var i = 0; i < req.cnt; i++) {
		
		if(req.list[i].coord == undefined) {
			console.log(req.list[i].name+" has errors!");
		}
		else {
			console.log(req.list[i].coord, req.list[i].name);
			var update_weather = new Weather({id:req.list[i].id,
												lat:req.list[i].coord.lat,
												lon:req.list[i].coord.lon,
												city:req.list[i].name,
												sunrise:req.list[i].sys.sunrise,
												sunset:req.list[i].sys.sunset,
												description:req.list[i].weather[0].description,
												temperature:req.list[i].main.temp
											});
			update_weather.save(function(err, result) {
				if(err) {
					res.send("Couldn't save");
				} 
			})	
		}
		
	}
}

setInterval(function() { checkMinute(); }, 60000);

weather.retrieveData = function(req, res) {
	Weather.find({}, function(err, results) {
		if(err) {
			res.send('something went wrong');
		} else {
			console.log(results);
			res.json(results);
		}
	})
}
module.exports = weather;
var date = new Date;
var minutes = date.getMinutes();
console.log(minutes);

function compare(a,b) {
	return a.temperature - b.temperature;
}

appModule.controller('MainCtrl', function ($scope, $http, weatherFactory){
	$scope.data = [];
	$scope.temp;

	weatherFactory.getWeatherData(function (data) {
		console.log("Calling Mongo for last updated weather");
		console.log(data);
		$scope.data = data;
		$scope.temp = data;
	})

	$scope.onClick = function(item) {
		$scope.$apply(function() {
			if (!$scope.showDetailPanel)
				$scope.showDetailPanel = true;
			$scope.detailItem = item;
		})
	}
	$scope.hottest = function() {
		var hotArray = [];
		$scope.data = $scope.temp;
		$scope.data.sort(function(a, b){
			return b.temperature - a.temperature;
		});

		for(var i =0; i < 10; i++){
			hotArray.push($scope.data[i]);
		}
		$scope.data = hotArray;
	}
	$scope.coldest = function() {
		var coldArray = [];
		$scope.data = $scope.temp;
		$scope.data.sort(function(a, b){
			return a.temperature - b.temperature;
		});
		for(var i =0; i < 10; i++){
			coldArray.push($scope.data[i]);
		}
		$scope.data = coldArray;
	}
	$scope.reset = function() {
		$scope.data = $scope.temp;
		console.log($scope.data);
	}
   
})

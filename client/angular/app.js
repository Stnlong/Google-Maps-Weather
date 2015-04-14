var appModule = angular.module('app', ['ngRoute', 'LocalStorageModule', 'd3']);

appModule
		.directive('d3Bars', ['$window', '$timeout', 'd3Service',
		function($window, $timeout, d3Service) {
		return {
			restrict: 'A',
			scope: {
			data: '=', // bi-directional data-binding
			label: '@',
			onClick: '&'
		},
		link: function(scope, ele, attrs) {
			d3Service.d3().then(function(d3) {
		 
		var renderTimeout;
		var margin = parseInt(attrs.margin) || 20,
		barHeight = parseInt(attrs.barHeight) || 20,
		barPadding = parseInt(attrs.barPadding) || 5;
		 
		var svg = d3.select(ele[0])
			.append('svg')
			.style('width', '100%');
		 
		$window.onresize = function() {
			scope.$apply();
		};
 
scope.$watch('data', function(newData) {
	scope.render(newData, "Hot");
}, true);

scope.render = function(data, param1) {
	svg.selectAll('*').remove();

	if (!data) return;
	if (renderTimeout) clearTimeout(renderTimeout);
	 
	renderTimeout = $timeout(function() {
		// Create the Google Map…
		var map = new google.maps.Map(d3.select("#map").node(), {
		  zoom: 4,
		  center: new google.maps.LatLng(37.09024, -95.712891),
		  mapTypeId: google.maps.MapTypeId.TERRAIN,
		  maxWidth: 200
		});

		// Load the data. When the data comes back, create an overlay.
		  var overlay = new google.maps.OverlayView();
		  var dataToOverlay = scope[attrs.data];	  
		  // Add the container when the overlay is added to the map.
		  overlay.onAdd = function() {
		    var layer = d3.select(this.getPanes().overlayMouseTarget).append("div")
		        .attr("class", "stations");
		    // Draw each marker as a separate SVG element.
		    // We could use a single SVG, but what size would it have?
		    overlay.draw = function() {
		      var projection = this.getProjection(),
		          padding = 10;

		      var marker = layer.selectAll("svg")

		          .data(d3.entries(data))
		          .each(transform) // update existing markers
		        .enter().append("svg:svg")
		          .each(transform)
		          .attr("class", "marker")
		          .attr("id", function(d) {return 'name' + d.key});
		      
		      marker.append("svg:a")
		      	  .attr("xlink:href", function(d){return d.value.city;})

		      // Add a circle.
		     .append("svg:circle")
		          .attr("r", function() {
		          	console.log(scope.data.length);
		          	if(scope.data.length == 10) {
		          		return 8.5
		          	}
		          	else {
		          		return 4.5
		          	}
		          })
		          .attr("cx", padding)
		          .attr("cy", padding)
		          .attr("id", 'circName')
      				.on('mouseover',function(d) {
		             d3.select(this)
		            	  .transition()
		            	  .duration(500)
		            	  .attr('r',10)
		            	  var temp = d3.select("#name"+d.key);
		            	  temp.append("svg:text")
						          .attr("x", padding + 7)
						          .attr("y", padding)
						          .attr("font-size", "13px")
						          .attr("font-weight", "bold")
						          .attr("id", function(d) {return 'textName' + d.key})
		         				 .text(function(d) { 
		          					return d.value.city+" "+d.value.temperature; 
						          	})
      						
		            })
      				.on('mouseout',function (d) {
			         d3.select(this)
				          .transition()
				          .duration(500)
				          .attr("r", 4.5)
				          var temp = d3.select("#textName"+d.key)
				          temp.remove()
				          
			        })
		          .transition()
		          .duration(2000)
		          .style("fill", function(d) {
		          	// console.log((d.value.temperature > 20) && (d.value.temperature < 30));
		          	console.log(d.value.city, d.value.temperature);
		          	if (d.value.temperature < -10) {
		          		return "rgb(255,0,255)";
		          	}
		          	else if(d.value.temperature >= -20 && d.value.temperature < -10) {
		          		return "rgb(158,0,255)";
		          	}
		          	else if(d.value.temperature >= -10 && d.value.temperature < 0) {
		          		return "rgb(0,0,255)";
		          	}
		          	else if(d.value.temperature >= 0 && d.value.temperature < 10) {
		          		return "rgb(0,126,255)";
		          	}
		          	else if(d.value.temperature >= 10 && d.value.temperature < 20) {
		          		return "rgb(0,204,255)";
		          	}
		          	else if(d.value.temperature >= 20 && d.value.temperature < 30) {
		          		return "rgb(5,247,247)";
		          	}
		          	else if(d.value.temperature >= 30 && d.value.temperature < 40) {
		          		return "rgb(127,255,0)";
		          	}
		          	else if(d.value.temperature >= 40 && d.value.temperature < 50) {
		          		return "rgb(247,247,5)";
		          	}
		          	else if(d.value.temperature >= 50 && d.value.temperature < 60) {
		          		return "rgb(255,204,0)";
		          	}
		          	else if(d.value.temperature >= 60 && d.value.temperature < 70) {
		          		return "rgb(255,153,0)";
		          	}
		          	else if(d.value.temperature >= 70 && d.value.temperature < 80) {
		          		return "rgb(255,79,0)";
		          	}
		          	else if(d.value.temperature >= 80 && d.value.temperature < 90) {
		          		return "rgb(204,0,0)";
		          	}
		          	else if(d.value.temperature >= 90 && d.value.temperature < 100) {
		          		return "rgb(169,3,3)";
		          	}
		          	else if(d.value.temperature >= 100) {
		          		return "rgb(186,50,50)";
		          	}
		          	else {
		          		return "black";
		          	}
		          })
				
			function drawCircle() {
				return marker
				.append("svg:circle")
		          .attr("r", 4.5)
		          .attr("cx", padding)
		          .attr("cy", padding)
		          .transition()
		          .duration(2000)
			}

		      function transform(d) {
		      	// console.log(d.value.lon);
		        d = new google.maps.LatLng(d.value.lat, d.value.lon);
		        d = projection.fromLatLngToDivPixel(d);
		        return d3.select(this)
		            .style("left", (d.x - padding) + "px")
		            .style("top", (d.y - padding) + "px");
		      }
		      function slide() {
		        var circle = d3.select(this);
		        (function repeat() {
		          circle = circle.transition()
		              .attr("r", 4.5)
		            .transition()
		              .attr("r", 8.5)
		              .ease("exp")
		              .each("end", repeat);
		        })();
		      }
		    };
		  };

		  // Bind our overlay to the map…
		  overlay.setMap(map);

	}, 200);
};
});
}}
}]) 
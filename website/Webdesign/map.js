var map;
var locations = [];
var info_windows=[]
function initialiseMap() {


  $.getJSON("https://sheets.googleapis.com/v4/spreadsheets/AIzaSyDfUZGrOEecuIO-isPQyb6tL6CK3pfccX4/values/Form Responses!A2:Q?key=AIzaSyDP5oYBNSJ5lFjKJjtFQaBfYe_lD12ZA68", function(data) {
		// data.values contains the array of rows from the spreadsheet. Each row is also an array of cell values.
		// Modify the code below to suit the structure of your spreadsheet.
		var info_windows={};
		$(data.values).each(function() {
			var location = {};
				location.title=this[2];
				location.msg=this[1];
				location.full_address=this[7];
				location.latitude = parseFloat(this[8]);
	  			location.longitude = parseFloat(this[9]);
	  			locations.push(location);
	  			
		});
	//done parsing.
	console.log('done parsing');
	  // Center on (0, 0). Map center and zoom will reconfigure later (fitbounds method)
	  var mapOptions = {
		zoom: 10,
		center: new google.maps.LatLng(0, 0)
	  };
	  console.log('done')
	  var map = new google.maps.Map(document.getElementById('map'), mapOptions);
	  setLocations(map, locations);
  });
}


function setLocations(map, locations) {
  var bounds = new google.maps.LatLngBounds();
  // Create nice, customised pop-up boxes, to appear when the marker is clicked on
  var infowindow = new google.maps.InfoWindow({
	content: ""
  });
  for (var i = 0; i < locations.length; i++) {
	var new_marker = createMarker(map, locations[i], infowindow);
	bounds.extend(new_marker.position);
  }
  map.fitBounds(bounds);
}

function createMarker(map, location, infowindow) {

  // Modify the code below to suit the structure of your spreadsheet (stored in variable 'location')
  var position = {
	lat: parseFloat(location.latitude),
	lng: parseFloat(location.longitude)
  };
  var marker = new google.maps.Marker({
	position: position,
	map: map,
	title: location.title,
  });
  google.maps.event.addListener(marker, 'click', function() {
	infowindow.setContent('<div><p><h3>' + location.title + '</h3></p>'+'<p>'+location.msg+'</p>'+location.full_address+'</p></div>');
	/*
	((location.institution === undefined) ? "" : ('<p><strong>Lead institution: </strong>' + location.institution + '</p>')) +
	((location.department === undefined) ? "" : ('<p><strong>Department: </strong>' + location.department + '</p>')) +
	((location.funder === undefined) ? "" : ('<p><strong>Funder: </strong>' + location.funder + '</p>')) +
	'</div>');
	*/
	infowindow.open(map, marker);
  });
  return marker;
}

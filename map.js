var map;
var stories = [];
var info_windows=[]
var oms;
function draw_map() {
	let key='AIzaSyDfUZGrOEecuIO-isPQyb6tL6CK3pfccX4';
	let ajax=new XMLHttpRequest();
	ajax.open('GET',"https://sheets.googleapis.com/v4/spreadsheets/1kn8vIEY1vZXtMSWz40bnvopderkFqYuvWx1lDg5uhvM/values/Form%20Responses!A2:Q?key="+key);ajax.setRequestHeader("Content-Type", "application/json");
	console.log('requested');
	ajax.send();
	ajax.onreadystatechange = function() {
            if (ajax.readyState == 4 && ajax.status == 200) {
                //console.log('responseText:' + xmlhttp.responseText);
                try {
                    var data = JSON.parse(ajax.responseText);
                } catch(err) {
                    console.log(err.message + " in " + ajax.responseText);
                    return;
                }
                on_success(data);
            }else{
                if(ajax.readyState == 4){
                    on_error();
                }
            }
        };
        
   function on_success(data){
	var info_windows={};
	var data_values=Array.from(data.values);
		data.values.forEach(function(value) {
			var story = {};
				story.title=value[2];
				story.age=value[3];
				story.msg=value[1];
				story.full_address=value[7];
				story.latitude = parseFloat(value[8]);
	  			story.longitude = parseFloat(value[9]);
	  			stories.push(story);
	  			
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
	  set_stories(map, stories);

 	}
 }
function set_stories(map, stories) {
  let bounds = new google.maps.LatLngBounds();
  let infowindow = new google.maps.InfoWindow({
	content: ""
  });
  for (let i = 0; i < stories.length; i++) {
	let new_marker = create_marker(map, stories[i], infowindow);
	bounds.extend(new_marker.position);
  }
  map.fitBounds(bounds);
}

function create_marker(map, story, infowindow) {

  var position = {
	lat: parseFloat(story.latitude),
	lng: parseFloat(story.longitude)
  };
  var marker = new google.maps.Marker({
	position: position,
	map: map,
	title: story.title,
  });

  google.maps.event.addListener(marker, 'click', function() {
	infowindow.setContent('<div><p><h3>' + story.title + ','+story.age+ '</h3></p>'+'<p>'+story.msg+'</p>'+story.full_address+'</p></div>');
	infowindow.open(map, marker);
  });
  return marker;
}


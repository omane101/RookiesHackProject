var columns={};
var column_keys=[];
function onFormSubmit(e){
	update_all_entries();	
}
//this is here to _maybe_ make it less fragile.
//basically instead of making the window hard-coded it'd make it specific to those items then extract the rectangle.
//but for now it's fine.
function get_column_names(){
  var spreadsheet = SpreadsheetApp.getActive();  
  var cur_sheet=spreadsheet.getSheetByName("Form Responses");
  values=cur_sheet.getRange('A1:K1').getValues();
  for(let i=0;i<=10;i++){
	column_keys[i]=values[0][i];
  }

}
function concatenate_addresses(){
  var spreadsheet = SpreadsheetApp.getActive();  
  var cur_sheet=spreadsheet.getSheetByName("Form Responses");
  var num_rows=cur_sheet.getMaxRows()-2;
  var range=cur_sheet.getRange(2, 5, num_rows,4);
  var data=range.getValues();
  var data_to_write=new Array(1);
	  data_to_write[0]=Array(1); 
  let Final="";
  var data=range.getValues();
  let k=2;
  let return_data=new Array(num_rows);
  for(i=0;i<num_rows;i++){
	address="";
	return_data[i]=new Array(1)
	if(data[i][3] == ""){
	  E=data[i][0]
	  address+=(E!="")?E+",":"";
	  F=data[i][1]
	  address+=(F!="")?F+",":"";  
	  G=data[i][2]
	  address+=(G!="")?G:"";
	  data_to_write[0]=address;
	  cur_sheet.getRange("H"+k).setValue(data_to_write);	  
	}
	return_data[i]=address;
	k++;
  }
  return return_data;
}

function fetch(url,params){
  return UrlFetchApp.fetch(url,params);
}

function get_json(input_string){
  return JSON.parse(input_string)['results'][0];
}

function latitude(json_result){
	return json_result['geometry']['location']['lat'];
}
function longitude(json_result){
  return json_result['geometry']['location']['lng'];
}

function _mark_stale(){
  var spreadsheet = SpreadsheetApp.getActive();  
  var cur_sheet = spreadsheet.getSheetByName('Form Responses');
  max=cur_sheet.getMaxRows()-1  
  var data=new Array(max);
  for(let i=0;i<max;i++){
	data[i]=new Array("Y");
  }
  cur_sheet.getRange("K2:K").setValues(data);
}

function update_all_entries() {
  if(columns == {}) get_column_names();
  let addresses=concatenate_addresses();
  var api_key="PLACE_YOUR_API_KEY_HERE";
  var response;
  var json;
  var lat;
  var lng;
  var spreadsheet = SpreadsheetApp.getActive();  
  var cur_sheet = spreadsheet.getSheetByName('Form Responses');
  //var cur_sheet=spreadsheet.getSheetByName("forms_editing");
  var address=""
  var num_rows=cur_sheet.getMaxRows()-2;
  var i=0;
  var E,F,G;
  var k=2;
  Logger.log(num_rows);
  var range=cur_sheet.getRange(2, 8, num_rows,2);
  var data=range.getValues();
  var data_to_write=new Array(1);
  for(i=0;i<num_rows;i++){
	address="";
	if(data[i][0] == "" || data[i][1] == ""){
	  data_to_write[0]=Array(2);
	  address=addresses[i];
	  //to instead use OSM you'd call it like the line jsut below this one.
	  response=fetch('https://maps.googleapis.com/maps/api/geocode/json?key='+api_key+'&address='+address);
	  //uncomment the line below then you'll be able to use it w/o having to pay the google api costs. A later version of this
	  //will actually cache the results so that we don't needlessly hit the API but for a quick demo it's fine.
	  //response=fetch('https://nominatim.openstreetmap.org/search?q='+address+'&format=jsonv2')
	  json=get_json(response.getContentText());
	  lat=latitude(json);
	  lng=longitude(json);
	  data_to_write[0][0]=lat;
	  data_to_write[0][1]=lng;
	  cur_sheet.getRange("I"+k+":J"+k).setValues(data_to_write);
	}
	k++;
  }

}

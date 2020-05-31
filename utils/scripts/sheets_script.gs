var columns={};
var column_keys=[];
//everytime the form is submitted this trigger is called because I have installed it to the spreadsheet.
function onFormSubmit(e){
	//call this function each time.
	update_all_entries();	
}

//this is here to _maybe_ make it less fragile.
//basically instead of making the window hard-coded it'd make it specific to those items then extract the rectangle.
//but for now it's fine.
function get_column_names(){
	//we get the current spreadsheet's object based upon the one that's active.
	var spreadsheet = SpreadsheetApp.getActive();
	//then we get the sheet we want to utilize.
	var cur_sheet=spreadsheet.getSheetByName("Form Responses");
	//get the values in the range specified. This will get all of the columns of the first row.
	values=cur_sheet.getRange('A1:K1').getValues();
	//iterate over all of the columns.
	for(let i=0;i<=10;i++){
		//populate the column's keys.
		column_keys[i]=values[0][i];
	}
}

function concatenate_addresses(){
	//once again get the active spreadsheet.
	var spreadsheet = SpreadsheetApp.getActive();	
	//get the sheet we want by name.
	var cur_sheet=spreadsheet.getSheetByName("Form Responses");
	//get the number of rows. Rows include both the first one our identifiers and they count from 1 so we have to subtract 2.
	var num_rows=cur_sheet.getMaxRows()-2;
	//get a range object that contains all values from row 2 till the bottom, and also get all columns from 5 to 9.
	var range=cur_sheet.getRange(2, 5, num_rows,4);
	//get the values from those cells.
	var data=range.getValues();
	//create a new 2d array to write data to.
	var data_to_write=new Array(1);
	//have a final string. 
	let Final="";
	//set our iterator k to 2 as that's the current actual row we're on.
	let k=2;
	//create a return data array that contains all of the final addresses.
	let return_data=new Array(num_rows);
	for(i=0;i<num_rows;i++){
		//set the current item of the array to a single element.
		return_data[i]=new Array(1)
		//see if the cell in the 3rd column of our range is empty or not.
		if(data[i][3] == ""){
			//get the data we're going to use.
			E=data[i][0]
			//append to the address this column if it's not empty. otherwise append empty string.
			address+=(E!="")?E+",":"";
			F=data[i][1]
			address+=(F!="")?F+",":"";	
			G=data[i][2]
			address+=(G!="")?G:"";
			data_to_write[0]=address;
			//finally write this value to the column labeled H at row k
			cur_sheet.getRange("H"+k).setValue(data_to_write);		
		}
		//append that address to our return addresses.
		return_data[i]=address;
		//increment k.
		k++;
	}
	//return our data.
	return return_data;
}

//just to avoid having to write the full fetch thing.
function fetch(url,params){
	return UrlFetchApp.fetch(url,params);
}
//simple json parser.
function get_json(input_string){
	return JSON.parse(input_string)['results'][0];
}
//gets the latitude for me.
function latitude(json_result){
	return json_result['geometry']['location']['lat'];
}
//same with longitude.
function longitude(json_result){
	return json_result['geometry']['location']['lng'];
}

//this was an old function to mark the data we had already gotten as stale.
//it's no longer used hence it starting with a dunder.
function __mark_stale(){
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
	//if(column_keys == {}) get_column_names();
	let addresses=concatenate_addresses();
	//place your API key here so that you can use this script yourself.
	var api_key="PLACE_YOUR_API_KEY_HERE";
	var response,json,lat,lng,address="",E,F,G;
	//get the active spreadsheet.
	var spreadsheet = SpreadsheetApp.getActive();	
	//change this name to whatever you want it to operate on.
	var cur_sheet = spreadsheet.getSheetByName('Form Responses');
	//var cur_sheet=spreadsheet.getSheetByName("forms_editing");
	//get the correct number of rows we're going to work on.
	var num_rows=cur_sheet.getMaxRows()-2;
	var i=0;
	var k=2;
	//log the number of rows. This is just so that I have something to see.
	Logger.log(num_rows);
	//get a range object of all cells from row 2 till the end, and from column 8 through 10.
	var range=cur_sheet.getRange(2, 8, num_rows,2);
	//read those cells and get the data.
	var data=range.getValues();
	//create an array to write to.
	var data_to_write=new Array(1);
	//make the first element contain 2 values.
		data_to_write[0]=Array(2);	
	for(i=0;i<num_rows;i++){
		address="";
		if(data[i][0] == "" || data[i][1] == ""){
			///get the current address from our previously computed ones.
			address=addresses[i];
			//to instead use OSM you'd call it like the line jsut below this one.
			response=fetch('https://maps.googleapis.com/maps/api/geocode/json?key='+api_key+'&address='+address);
			//uncomment the line below then you'll be able to use it w/o having	 to pay the google api costs. A later version of this
			//will actually cache the results so that we don't needlessly hit the API but for a quick demo it's fine.
			//response=fetch('https://nominatim.openstreetmap.org/search?q='+address+'&format=jsonv2')
			//parse our json data.
			json=get_json(response.getContentText());
			//get the latitude.
			lat=latitude(json);
			//get the longitude.
			lng=longitude(json);
			//set them up in our data array.
			data_to_write[0][0]=lat;
			data_to_write[0][1]=lng;
			//get a range of the cells of the current row. Then write the values to them.
			cur_sheet.getRange("I"+k+":J"+k).setValues(data_to_write);
		}
		k++;
	}

}

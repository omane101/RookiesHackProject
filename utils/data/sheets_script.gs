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
function myFunction() {
  var api_key="AIzaSyB_2BONXk3nauknsBj769cirLUJv_vAjGY"
  var response;
  var json;
  var lat;
  var lng;
  var spreadsheet = SpreadsheetApp.getActive();  
  var cur_sheet = spreadsheet.getSheetByName('Form Responses');
  var address=""
  var num_rows=cur_sheet.getMaxRows()-1;
  var i=0;
  var E,F,G;
  var k=2;
  var range=cur_sheet.getRange(2, 5, num_rows,3);
  var data=range.getValues();
  for(i=0;i<num_rows;i++){
    address="";
    E=data[i][0]
    address+=(E!="")?E+",":"";
    F=data[i][1]
    address+=(F!="")?F+",":"";  
    G=data[i][2]
    address+=(G!="")?G+",":"";
    response=fetch('https://maps.googleapis.com/maps/api/geocode/json?key='+api_key+'&address='+address);
    json=get_json(response.getContentText());
    lat=latitude(json);
    lng=longitude(json);
    cur_sheet.getRange("H"+k).setValue(lat);
    cur_sheet.getRange("I"+k).setValue(lng);
    k++;
  }

}

function onFormSubmit(e){
    update_all_entries();    
}

function concatenate_addresses(){
  var spreadsheet = SpreadsheetApp.getActive();  
  //var cur_sheet = spreadsheet.getSheetByName('Form Responses');
  var cur_sheet=spreadsheet.getSheetByName("Form Responses");
  let data = cur_sheet.getRange("E2:H2").getValues();
  let Final="";
  Logger.log(data.join(" "));
  Logger.log(!data[1]);
  let E=(!data[0])?"":data[0];
  let F=(!data[1])?"":data[1];
  let G=data[2];
  Final+=E
  Final+=F
  Final+=G
  Logger.log(Final);
  //cur_sheet.getRange("H2").setValue(Final);
  
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
function update_all_entries() {
  var api_key="BLANK_FOR_A_REASON";
  //insert real API key I have to edit/remove mine.
  var api_key=""
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
  var range=cur_sheet.getRange(2, 5, num_rows,6);
  var data=range.getValues();
  var data_to_write=new Array(1);
  for(i=0;i<num_rows;i++){
    address="";
    if(data[i][4] == "" || data[i][5] == ""){
      data_to_write[0]=Array(3);
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
      Logger.log(i)
      data_to_write[0][0]=lat;
      data_to_write[0][1]=lng;
      cur_sheet.getRange("I"+k+":J"+k).setValues(data_to_write);
      k++;
    }
  }

}


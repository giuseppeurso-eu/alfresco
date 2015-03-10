// Name: Report - All users
// Date: 2015.03.06
// Author: Giuseppe Urso - www.giuseppeurso.eu
// Notes: A basic javascript webscripts to retrieve all
//		  folders in the Alfresco Company Home recursively using CMIS query
//
// References:
// https://wiki.alfresco.com/wiki/CMIS_Query_Language
// -------------------------------------------------------------------

var today = Date();

// Get Company Home noderef
var uuid = companyhome.properties["{http://www.alfresco.org/model/system/1.0}node-uuid"];
var nodeRef= "workspace://SpacesStore/"+uuid;

var query = "select cmis:name from cmis:folder where in_tree('"+nodeRef+"')";

var start = new Date().getTime();
elements = search.query({language: "cmis-alfresco", query: query});

var end = new Date().getTime();
var time = end - start;

//Elapsed time in a human readable format 
if (time >= 60000){
	execution = (time/60)/1000+ " min.";
}
if (time>0 && time<60000){
	execution = time/1000+" sec.";
}

model.total = elements.length;
model.results = elements;
model.today = today;
model.execution = execution;

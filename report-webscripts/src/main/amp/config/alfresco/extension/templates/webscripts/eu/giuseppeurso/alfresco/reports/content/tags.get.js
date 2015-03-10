// Name: Report - All users
// Date: 2015.03.010
// Author: Giuseppe Urso - www.giuseppeurso.eu
// Notes: A basic javascript webscripts to retrieve Alfresco tags
//
// References:
// http://docs.alfresco.com/4.0/references/API-JS-TaggingService-getTags.html
// -------------------------------------------------------------------

var today = Date();

var start = new Date().getTime();
var tags = taggingService.getTags("workspace://SpacesStore");
var end = new Date().getTime();
var time = end - start;

//Elapsed time in a human readable format 
if (time >= 60000){
	execution = (time/60)/1000+ " min.";
}
if (time>0 && time<60000){
	execution = time/1000+" sec.";
}

model.tags = tags;
model.total=tags.length;
model.today = today;
model.execution = execution;
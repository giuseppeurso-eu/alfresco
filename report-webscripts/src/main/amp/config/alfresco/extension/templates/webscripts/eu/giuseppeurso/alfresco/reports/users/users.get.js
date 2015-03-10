// Name: Report - All users
// Date: 2015.03.06
// Author: Giuseppe Urso - www.giuseppeurso.eu
// Notes: A basic javascript webscripts to retrieve the list of
//        users in Alfresco
//
// References:
// http://docs.alfresco.com/4.2/references/API-JS-getPeople.html
// https://github.com/Alfresco/community-edition/blob/master/projects/surf/spring-webscripts/spring-webscripts/src/main/java/org/springframework/extensions/webscripts/DefaultURLModel.java
// -------------------------------------------------------------------

var today = Date();

// Get the collection of people
var start = new Date().getTime();
var peopleCollection = people.getPeople(null);
var end = new Date().getTime();
var time = end - start;

// Elapsed time in a human readable format 
if (time >= 60000){
	execution = (time/60)/1000+ " min.";
}
if (time>0 && time<60000){
	execution = time/1000+" sec.";
}

//Pass results to the template
model.peoplelist = peopleCollection;
model.total = peopleCollection.length;
model.today = today;
model.execution = execution;

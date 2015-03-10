// Name: Report - All users
// Date: 2015.03.06
// Author: Giuseppe Urso - www.giuseppeurso.eu
// Notes: A basic javascript webscripts to retrieve user groups
//		  excluding the names which contain string "site"
//
// References:
// http://docs.alfresco.com/4.2/references/API-JS-Utility-createPaging.html
// -------------------------------------------------------------------

var today = Date();

// createPaging(maxItems, skipCount)
//- maxItems: An integer value which sets the maximum number of results to return.
//- skipCount: The number of results to skip.
var paging = utils.createPaging(-1, 0); 

// A filter for the search string
var filter = "";

// Get all groups in Alfresco
var start = new Date().getTime();
var gs = groups.getGroups(filter, paging);

// Excluding the site_* group names 
var noSiteGroups=[];
for each(var g in gs) {
  if (g.displayName.indexOf("site")<0){
    noSiteGroups.push(g.displayName);  
  }
}
var end = new Date().getTime();
var time = end - start;

//Elapsed time in a human readable format 
if (time >= 60000){
	execution = (time/60)/1000+ " min.";
}
if (time>0 && time<60000){
	execution = time/1000+" sec.";
}

model.groups = noSiteGroups;
model.total = noSiteGroups.length;
model.today = today;
model.execution = execution;




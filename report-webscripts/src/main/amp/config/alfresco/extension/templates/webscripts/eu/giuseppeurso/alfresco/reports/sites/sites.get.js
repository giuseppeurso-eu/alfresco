// Name: Report - All users
// Date: 2015.03.06
// Author: Giuseppe Urso - www.giuseppeurso.eu
// Notes: A basic javascript webscripts to retrieve all
//		  sites in Alfresco
//
// References:
// http://docs.alfresco.com/4.0/references/API-JS-SiteserviceObject.html
// -------------------------------------------------------------------

var today = Date();

var start = new Date().getTime();
var sites = siteService.getSites(null, null, 0);
var end = new Date().getTime();
var time = end - start;

//Elapsed time in a human readable format 
if (time >= 60000){
	execution = (time/60)/1000+ " min.";
}
if (time>0 && time<60000){
	execution = time/1000+" sec.";
}

model.sites = sites;
model.total = sites.length;
model.today = today;
model.execution = execution;
// Name: Report - All users
// Date: 2015.03.06
// Author: Giuseppe Urso - www.giuseppeurso.eu
// Notes: A basic javascript webscripts to run a filtered content search by type.
// 		  Retrieve recursively all content in a folder using CMIS query.
//
// References:
// https://wiki.alfresco.com/wiki/CMIS_Query_Language
// https://github.com/Alfresco/community-edition/blob/master/projects/surf/spring-webscripts/spring-webscripts/src/main/java/org/springframework/extensions/webscripts/DefaultURLModel.java
// -------------------------------------------------------------------

var today = Date();


//folderNodeRef=workspace://SpacesStore/50bb4ccf-ea89-4d4c-a3de-d6cc3de23bde&type=gius:doc_fatture

var folder = args.folderNodeRef;		  
var type = args.type;

var start = new Date().getTime();
var query = "select cmis:name from "+type+" where in_tree('"+folder+"')";
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
model.type = type;
model.today = today;
model.execution = execution;

var currentNode = search.findNode(folder);
model.folder = currentNode.properties["name"];


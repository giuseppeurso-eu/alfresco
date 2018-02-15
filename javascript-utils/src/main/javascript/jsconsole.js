
///////////////////
// A simple lucene search
var nodes = search.luceneSearch("@name:alfresco");

for each(var node in nodes) {
    logger.log(node.name + " (" + node.typeShort + "): " + node.nodeRef);
}

///////////////
// Rimozione aspect Hidden su un site
siteService.getSite("sto_iccs").node.removeAspect("sys:hidden")


/////////////
// Apache-commons trim in JS
var trim = Packages.org.apache.commons.lang.StringUtils.trim;
var ex = "JOE BLACK Junior";
logger.log("Fullname: "+ex);
if(ex.indexOf(' ') !== -1){
  //var fullname = ex.split("  ");
//  var cognome = fullname[0];
//  var nome = fullname[1];
  var cognome = trim(ex.substr(0,ex.indexOf(' ')));
  var nome = trim(ex.substr(ex.indexOf(' '),ex.length));
  logger.log("Nome: "+nome);
  logger.log("Cognome: "+cognome);
}


//////////////////
// Creating Content of a given Type
var node1 = userhome.createNode('test1.txt', 'cm:content');

/////////////////
// Changing type
var doc = search.findNode("xxxx");
var doc.specializeType("acme:duffy");


//////////////////
// RIMOZIONE NODI (max results 1000)
// circa 4/5 min elapsed
var nodes = search.luceneSearch("+TYPE:\"acme:contact\"");
var counter=0;
for each(var node in nodes) {
  logger.log("["+counter+"] - NODE: "+node.name + " (" + node.typeShort + "): " + node.nodeRef);
  node.remove();
  counter++;
}

// Rimozione con max length fissa
for (var i = 0; i < 100; i++) {
	  logger.log(i+ " Elem: "+nodes[i].name);
	  nodes[i].remove();
}

//////////////////////////
// READ from json content
// Resources: http://codebeautify.org/csv-to-xml-json#

logger.log("Start import...");

// the json content
var node = search.findNode("workspace://SpacesStore/a113ae64-9104-4056-9405-1cc1ac44b48f"), 
  adb = search.findNode("workspace://SpacesStore/6773ab4b-127c-4d45-917a-925d477c352e"), 
  json = jsonUtils.toObject(node.content),
  trim = Packages.org.apache.commons.lang.StringUtils.trim;

for(var i in json){
  var contact = json[i], tels = [], contactNode = adb.createNode(null, "acme:contact");
  if(contact.title && (contact.title=="DIP" || contact.title=="PRF")){
      contactNode.properties["acme:personType"] = "pf";     
//      if(contact.name.indexOf('  ') !== -1){
//      	//var fullname = contact.name.split("  ");
//      	contactNode.properties["acme:surname"] = trim(contact.name.substr(0, contact.name.indexOf('  ')));
//      	contactNode.properties["acme:name"] = trim(contact.name.substr(contact.name.indexOf('  '),contact.name.length));
//      }  
  } else {
      contactNode.properties["acme:personType"] = "pg";
  }
  contactNode.properties["acme:title"] = trim(contact.title);
  contactNode.properties["acme:address"] = trim(contact.address); 
  contactNode.save();
}


/////////////////////////
/// ITERAZIONI SU NODI
var rootFolder = search.findNode("workspace://SpacesStore/6e9fed49-c897-4a7f-afd5-bbdc32065477");
logger.log("TOTAL childs: "+rootFolder.children.length);
//logger.log("child name: "+rootFolder.childFileFolders(true,false)[0].name);

// Less fast
for(var i=0;i<rootFolder.children.length;i++){
logger.log("child name: "+rootFolder.children[i].name);
}
// More fast
for each (el in rootFolder.children)
{
   logger.log("child name: "+el.name);
}

////////////////////////////
/// CONTAINER
siteService.getSite("sto_iccs").node;
logger.log(siteService.getSite("sto_iccs").node.nodeRef);

siteService.getSite("sto_iccs").getContainer("folder_name");
logger.log(siteService.getSite("sto_iccs").getContainer("folder_name").nodeRef);

siteService.getSite("sto_iccs").getContainer("folder_name").createFolder("Test");


////////////////////////////
/// COUNTER
var containerReg = siteService.getSite("test").getContainer("folder_name");
logger.log(containerReg.nodeRef);
containerReg.properties["acme:counter"]=11;
containerReg.save();

//////////////////////////
/// RIMOZIONE NODO
var n = search.findNode("workspace://SpacesStore/113eb8d0-b8ad-4f6d-959a-5b2781064a99");
logger.log(n.name);
n.remove();

///// CMIS
var query = "SELECT D.cmis:objectId FROM cmis:document AS D JOIN acme:readReceipt AS O ON D.cmis:objectId = O.cmis:objectId where in_tree(D,'" + container + "')";

var elements = search.query({
	language: "cmis-alfresco",
	query: query
});
	
for ( var el in elements) {
	elements[el].properties["acme:wasRead"] = true;
	elements[el].save();
}


///// RICERCA in una folder (MAX 1000)
var base = siteService.getSite("site_name").getContainer("folder_name");
var query = "SELECT * FROM acme:protocol where in_tree('"+base+"')";

var elements = search.query({
			language: "cmis-alfresco",
			query: query
		});

logger.log("TOTAL Results: "+elements.length);
for (var el in elements) {
  logger.log("Node="+elements[el].properties["cm:name"]);
}


//////////////////// MOVE Folders 
var rootScarico = search.findNode("workspace://SpacesStore/db21314b-b54a-4ff3-b0e6-0afb1de4590e");
var childs=rootScarico.getChildren();
logger.log("TOT SOURCE CHILDS:"+childs.length);
var dest = search.findNode("");
var count=0;

for each(var node in childs) {
  if(count<250){
    logger.log("");
    logger.log(node.name + " (" + node.typeShort + "): " + node.nodeRef);   
    logger.log("Orig Path: "+node.displayPath);
    node.move(dest);
    logger.log("Dest Path: "+node.displayPath);
    totalMoved = count;
  }
  count++;  
}
logger.log("");
logger.log("TOTAL MOVED: "+(totalMoved+1));


////// LISTA PAGINATA PER RICERCHE MASSIVE 
/////
var base = siteService.getSite("mysite").getContainer("folder_name");
var q = "SELECT * FROM acme:protocol where in_tree('"+base.nodeRef+"')";


var maxResultsPerPage=1000;
var skipResults=0;
var page=0;
while(maxResultsPerPage==1000){
  logger.log("PAGE: "+(page+1));
  var paging = 
  { 
    maxItems: 1000, 
    skipCount: skipResults
  }; 
  logger.log("maxItems: "+maxResultsPerPage);
  logger.log("skipCount: "+skipResults);
  
  var def = 
  { 
    query: q, 
    language: "cmis-alfresco",  
    page: paging 
  };
  var currentResults = search.query(def);
  maxResultsPerPage = currentResults.length;
  //for (var el in currentResults) {
  //  logger.log("Node ID= "+currentResults[el].nodeRef);
  //  logger.log("Node Name= "+currentResults[el].properties["cm:name"]);
  //  logger.log(currentResults[el].nodeRef+"|"+currentResults[el].properties["cm:name"]+"|"+currentResults[el].properties["acme:subject"]);
  //}
  
  logger.log("Results per Page: "+maxResultsPerPage);
  skipResults += maxResultsPerPage;
  logger.log("");
  logger.log("----------------------");
  page++;
}
logger.log("");
logger.log("TOTAL RESULTS: "+skipResults);
var finish = new Date();
logger.log("Finished at: "+finish);

////////////
///////////

/////////// TUTTI GLI UTENTI - getPeople(filter, maxResults) get the collection of people stored in the repository.
/////////// Il filtro cerca su firstName, lastName e username
var user;
var nodes = people.getPeople(null,0);
counter=0;
for each(var node in nodes)
{ 
  //logger.log(node); 
  user = utils.getNodeFromString(node); 
  logger.log(user.properties["cm:firstName"] +" " + user.properties["cm:lastName"]+ " ["+user.properties["cm:userName"]+"]"); 
  counter++;
}         
print("TOTAL:"+counter);        
////////////


////////  SOLO GLI UTENTI BUILT-IN ALFRESCO (max 1000 results)
var nodes = search.luceneSearch("PATH:\"/sys:system/sys:zones/cm:AUTH.ALF/*\" AND TYPE:\"cm:person\"");
for each(var node in nodes) {
  logger.log(node.properties["cm:userName"] + " (" + node.typeShort + "): " + node.nodeRef );
 
}
logger.log("TOTAL: "+nodes.length);

////////  SOLO GLI UTENTI LDAP  (ldap1 e' il nome dato al subsystem esterno, vedi global.properties)
var nodes = search.luceneSearch("PATH:\"/sys:system/sys:zones/cm:AUTH.EXT.ldap1/*\" AND TYPE:\"cm:person\"");
for each(var node in nodes) {
  logger.log(node.properties["cm:userName"] + " (" + node.typeShort + "): " + node.nodeRef );
 ;
}
logger.log("TOTAL: "+nodes.length);


////////////// CREA UTENTE
/////////////
//createPerson(username, firstName, lastName, emailAddress, password, setAccountEnabled)

people.createPerson("test.test", "Test", "Svi", "test@em.it", "test", true);


/////////// ASSOCIATIONS (caso source assocs)
///////////
var user;
var nodes = people.getPeople(null,0);
counter=0;
for each(var node in nodes)
{ 
//logger.log(node); 
user = utils.getNodeFromString(node); 
logger.log("");
logger.log(user.properties["cm:firstName"] +" " + user.properties["cm:lastName"]+ " ["+user.properties["cm:userName"]+"]"); 
print("---------------------");
var assocs = user.sourceAssocs["acme:usersAssoc"];
if(assocs){
print("Total Assocs: "+assocs.length);

for each(aNode in assocs){
print("Assoc Noderef: "+aNode.nodeRef);
print("Assoc Name: "+aNode.name);
print("Assoc Site: "+aNode.siteShortName);
print("");
}

}
counter++;
}         
print("TOTAL USERS:"+counter);     


/////////// QUERY CMIS con filtro proprieta NULL
///////////
var container = siteService.getSite("mysite").getContainer("folder_name");
//var q = "SELECT * FROM acme:protocol WHERE in_tree('"+container.nodeRef+"')";
var q = "SELECT * FROM acme:protocol WHERE acme:notes IS NOT NULL";
var nodes = search.query({
				language: "cmis-alfresco",
				query: q
			});
var total=0;
// Max 1000 Results
for(n in nodes){
	logger.log(nodes[n].properties["acme:protocolNumber"] +" "+nodes[n].properties["acme:notes"]);
}
logger.log("TOTAL: "+total);
///////////
///////////



/////////// TAG e TAG SCOPE
///////////
// Prendo il nodo di una email 
var n =  search.findNode("workspace://SpacesStore/52563a60-cf3a-426f-a5da-e51f6596a4f2");
print(n.nodeRef);
print(n.tagScope.tags);
n.tagScope.refresh();


/////////// TAG SCOPE caso su tutti gli account nel container folder_name
///////////
var pecFolder = siteService.getSite("mysite").getContainer("folder_name");
print(pecFolder.name);
var count =0;
for(var i=0;i<pecFolder.children.length;i++){
  var account = pecFolder.children[i];
  if(account.isTagScope){
    print("Aggiorno child name: "+account.name);
    account.tagScope.refresh();
    count++;   
  } 
}
logger.log("");
logger.log("TOTALE TagScope aggiornati: "+count);


/////////// TUTTE le uo di un site
///////////
var base = siteService.getSite("mysite").getContainer("folder_name");
var q = "SELECT * FROM acme:nodeUo where in_tree('"+base.nodeRef+"')";

var elements = search.query({
			language: "cmis-alfresco",
			query: q
		});
logger.log("TOTAL Results: "+elements.length);
for (var el in elements) {
  logger.log("Node="+elements[el].properties["cm:name"]);
}


////////////// Tutte le associazioni acme:protocolDocument di un nodo
//////////////
var nodes = search.luceneSearch("+TYPE:\"acme:protocol\"");
var counter=0;
for each(var node in nodes) {
  logger.warn("["+counter+"] - NODE: "+node.name + " (" + node.typeShort + "): " + node.nodeRef);
      
  var assocs = node.assocs["acme:protocolDocument"];
  if(assocs){
	  logger.warn("Total Assocs: "+assocs.length);
	  for each(aNode in assocs){
		logger.warn("Assoc Noderef: "+aNode.nodeRef);
		logger.warn("Assoc Name: "+aNode.name);
		logger.warn("Assoc Site: "+aNode.siteShortName);
		logger.warn("");
	  }
  }
}


////////////// Aspetti
//////////
var n = search.findNode("workspace://SpacesStore/7ed30a76-46e5-4208-a256-4d246064f254");
logger.log(n.name);
n.addAspect('acme:trashed');
n.removeAspect('acme:trashed');
n.hasAspect('acme:trashed');


////////////////// Datetime e ISO8601 Date
//////////////////
//Print: Tue Feb 21 2017 11:06:52 GMT+0100 (CET)
var date = new Date();
logger.log("Date: "+date);

// Print: 1487671677960
var timeInMillisecs = date.getTime();
logger.log("Millsec: "+timeInMillisecs);

// Print: 2017-02-21T11:08:55.466+01:00
var ISODate = utils.toISO8601(timeInMillisecs);
logger.log("Iso Date: "+ISODate);

// Print: Tue Feb 21 2017 11:06:52 CET 2017
var origDate = utils.fromISO8601(ISODate);
logger.log("Oringinal Date: "+origDate);

// Date TO Iso Date
var date = new Date();
var ISODate = utils.toISO8601(date);


////////////////// Create multiple nodes
/////////////////
var nodesNumb=10;
var dateTime = new Date("2010","10","30","21","30","00");
for(i=0; i < nodesNumb; i++){
  //logger.log("Element: "+i);
  var testNode = testFolder.createNode(null, "pec:mail");
  logger.log("Date: "+testNode.properties["cm:modified"]);
  testNode.addAspect("pec:trashed");
  testNode.properties["pec:mailDate"]=dateTime;
  testNode.save();
}


////////////////// Query massiva su DateTime
//////////////////
var maxDate='2016-08-25T23:59:59+02:00';
//var query="+PATH:\"/app:company_home/cm:test-trashed//*\" AND +TYPE:\"pec:mail\" AND +ASPECT:\"pec:trashed\" AND +pec:mailDate:[MIN TO MAX]";
var query='+PATH:"/app:company_home/cm:test-trashed//*" AND +TYPE:"pec:mail" AND +ASPECT:"pec:trashed" AND +pec:mailDate:[MIN TO \''+maxDate+'\']';

var maxResultsPerPage=1000;
var skipResults=0;
var page=0;
while(maxResultsPerPage==1000){
logger.log("PAGE: "+(page+1));
var paging = 
{ 
  maxItems: 1000, 
  skipCount: skipResults
}; 
logger.log("maxItems: "+maxResultsPerPage);
logger.log("skipCount: "+skipResults);

var def = 
{ 
  query: query, 
  language: "fts-alfresco",  
  page: paging 
};
var currentResults = search.query(def);
maxResultsPerPage = currentResults.length;
//for (var el in currentResults) {
//  logger.log("Node ID= "+currentResults[el].nodeRef);
//  logger.log("Node Name= "+currentResults[el].properties["cm:name"]);
//  logger.log(currentResults[el].nodeRef+"|"+currentResults[el].properties["cm:name"]+"|"+currentResults[el].properties["acme:subject"]);
//}

logger.log("Results per Page: "+maxResultsPerPage);
skipResults += maxResultsPerPage;
logger.log("");
logger.log("----------------------");
page++;
}
logger.log("");
logger.log("TOTAL RESULTS: "+skipResults);
var finish = new Date();
logger.log("Finished at: "+finish);



////////////////////// Classification and Categories
//////////////////////


var classificationAspects = classification.getAllClassificationAspects();
logger.log("Classification Aspects: "+classificationAspects.length);
for(var i in classificationAspects){
  logger.log(" "+classificationAspects[i]);
}
logger.log("");

var categoryRootNodesGenClass = classification.getRootCategories("cm:generalclassifiable");
logger.log("All Root Category Nodes in 'cm:generalclassifiable' :"+categoryRootNodesGenClass.length);
for(var i in categoryRootNodesGenClass){
  logger.log(" "+categoryRootNodesGenClass[i].name+" - TYPE: "+categoryRootNodesGenClass[i].type);
}
logger.log("");

var categoryNodesGenClass = classification.getAllCategoryNodes("cm:generalclassifiable");
logger.log("All Category Nodes in 'cm:generalclassifiable' : "+categoryNodesGenClass.length);
for(var i in categoryNodesGenClass){
  //logger.log(" "+categoryNodesGenClass[i].name+" - TYPE: "+categoryNodesGenClass[i].type);
}
logger.log("");



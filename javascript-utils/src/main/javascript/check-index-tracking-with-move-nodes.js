/* =============================================================================
 * Test the Solr tracker and index updates, when a node
 * is moved from a space to another.
 * By default Solr checks Alfresco for updated content every 15 seconds
 * (see solrcore.properties)
 * alfresco.cron=0/15 * * * * ? *
 * 
 * =============================================================================
 */
var account = search.findNode("workspace://SpacesStore/20919627-0a43-4937-bbff-f7037f8098f5");
var emails = new Array();
logger.log(account.name);
var dest = search.findNode("workspace://SpacesStore/87860c31-59db-4de4-bc46-da2895772c71");

var typeToSearch = "", mailFolder = null, query = "", queryFilter = "";
var mailFolder = account.childByNamePath("inbox");
//var queryFilter = '-ASPECT:"pec:trashed"'; 
//typeToSearch = "Deleted";

/* ================================================================================
 * QUERY 1: searches in mailFolder with Lucene and moves nodes into dest folder
 * ================================================================================
*/
query = '+PATH:"'+mailFolder.qnamePath+'//*" +TYPE:"pec:mail'+typeToSearch+'" '+queryFilter;
//logger.log("Query: "+query);
var elements = search.query({
			language: "lucene",
			query: query
		});
logger.log("TOTAL Results in INBOX: "+elements.length);
for (var el in elements) {
  logger.log("Node="+elements[el].properties["cm:name"]);
  //elements[el].removeAspect('pec:trashed');
  //elements[el].addAspect('pec:trashed');
  elements[el].move(dest);
}

/* ================================================================================
 * QUERY 2: searches in dest with Lucene
 * ================================================================================
*/
query = '+PATH:"'+dest.qnamePath+'//*" +TYPE:"pec:mail'+typeToSearch+'" '+queryFilter;
elements = search.query({
			language: "lucene",
			query: query
		});
logger.log("");
//logger.log("Query: "+query);
logger.log("TOTAL Results in TRASH: "+elements.length);
for (var e in elements) {
  logger.log("Node="+elements[e].properties["cm:name"]);
  //elements[el].removeAspect('pec:trashed');
  //elements[el].addAspect('pec:trashed');
  //elements[e].move(mailFolder);
}

/* ================================================================================
 * QUERY 3: searches in dest by using getChildren()
 * ================================================================================
*/
var childs=dest.getChildren();
logger.log("");
logger.log("Children in TRASH:");
for each(var n in childs) {
  
    //logger.log(n.name);   
    //logger.log("Orig Path: "+n.displayPath);
 //var props = n.getPropertyNames(true);
// logger.log(props);
  if(n.typeShort.contains("pec:mail")){
    logger.log(n.name);   
  }

}


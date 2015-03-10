var start = new Date().getTime();



function sleep(delay) {
    var start = new Date().getTime();
    while (new Date().getTime() < start + delay);
  }



var today = Date();
var filter = args["filter"];
var maxResults = args["maxResults"];
var sortBy = args["sortBy"];
var sortAsc = args["dir"] != "desc";

// Get the collection of people
var peopleCollection = people.getPeople(filter, maxResults != null ? parseInt(maxResults) : 0, sortBy, sortAsc);

// Pass the queried sites to the template
model.peoplelist = peopleCollection;
model.total = peopleCollection.length;
model.today = today;
sleep(65000);


var end = new Date().getTime();
var time = end - start;

if (time >= 60000){
	execution = (time/60)/1000+ " min.";
	
}
if (time>0 && time<60000){
	execution = time/1000+" sec.";
}
model.execution = execution;
model.time=time;
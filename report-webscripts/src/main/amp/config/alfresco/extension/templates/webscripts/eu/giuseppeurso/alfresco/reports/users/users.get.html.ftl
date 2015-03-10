<html>
<head>
<link rel="stylesheet" type="text/css" href="${url.context}/css/report-webscripts.css">
</head>

<body>
<p class="reportTitle">Alfresco Host: <span class="reportData"> ${url.server}</span></p>
<p class="reportTitle">Webscript: <span class="reportData"> ${url.full}</span></p>
<p class="reportTitle">Date: <span class="reportData"> ${today}</span></p>

<hr>

<div class="caption reportTitle">TOTAL USERS: ${total}</div>
<div class="caption">Execution time: ${execution}</div>		
<div id="table">
	<div class="header-row row">
	<span class="cell primary">Number</span>
    <span class="cell primary">NodeRef</span>
    <span class="cell">Username</span>
  </div>
<#list peoplelist as people>
  <div class="row">
     <#assign props = people.properties?keys>
     <span class="cell primary" data-label="Vehicle">${people_index +1}</span>
     <span class="cell primary" data-label="Vehicle">workspace://SpacesStore/${people.properties["name"]}</span>
      <span class="cell" data-label="Exterior">${people.properties["userName"]}</span>
   </div>
</#list>  
</div>
</body>
</html>

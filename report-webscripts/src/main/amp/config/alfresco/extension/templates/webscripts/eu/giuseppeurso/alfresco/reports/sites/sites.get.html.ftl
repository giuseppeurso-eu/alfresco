<html>
<head>
<link rel="stylesheet" type="text/css" href="${url.context}/css/report-webscripts.css">
</head>
<body>

<p class="reportTitle">Alfresco Host: <span class="reportData"> ${url.server}</span></p>
<p class="reportTitle">Webscript: <span class="reportData"> ${url.full}</span></p>
<p class="reportTitle">Date: <span class="reportData"> ${today}</span></p>

<hr>

<div class="caption reportTitle">TOTAL SITES: ${total}</div>
<div class="caption">Execution time: ${execution}</div>		
<div id="table">
	<div class="header-row row">
	 <span class="cell primary">Number</span>
     <span class="cell primary">Site Name</span>
     <span class="cell primary">Site Description</span>
    </div>
<#list sites as s>
  <div class="row">
     <span class="cell primary" data-label="Vehicle">${s_index +1}</span>
     <span class="cell primary" data-label="Vehicle">${s.title}</span>
     <span class="cell primary" data-label="Vehicle">${s.description}</span>
   </div>
</#list>  
</div>


</body>
</html>

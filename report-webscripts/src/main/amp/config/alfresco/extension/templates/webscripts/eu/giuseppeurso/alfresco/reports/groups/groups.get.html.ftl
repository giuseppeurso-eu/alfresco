<html>
<head>
<link rel="stylesheet" type="text/css" href="${url.context}/css/report-webscripts.css">
</head>
<body>
<p class="reportTitle">Alfresco Host: <span class="reportData"> ${url.server}</span></p>
<p class="reportTitle">Webscript: <span class="reportData"> ${url.full}</span></p>
<p class="reportTitle">Date: <span class="reportData"> ${today}</span></p>

<hr>

<div class="caption reportTitle">TOTAL GROUPS: ${total}</div>
<div class="caption">Execution time: ${execution}</div>		
<div id="table">
	<div class="header-row row">
	 <span class="cell primary">Number</span>
     <span class="cell primary">Group Name</span>
    </div>
<#list groups as g>
  <div class="row">
     <span class="cell primary" data-label="Vehicle">${g_index +1}</span>
     <span class="cell primary" data-label="Vehicle">${g}</span>
   </div>
</#list>  
</div>
</body>
</html>

<html>
<head>
<link rel="stylesheet" type="text/css" href="${url.context}/css/report-webscripts.css">
</head>
<body>

<p class="reportTitle">Alfresco Host: <span class="reportData"> ${url.server}</span></p>
<p class="reportTitle">Webscript: <span class="reportData"> ${url.full}</span></p>
<p class="reportTitle">Date: <span class="reportData"> ${today}</span></p>
<hr>

<div class="caption reportTitle">TOTAL: ${total}</div>
<div class="caption">Execution time: ${execution}</div>
<div class="caption">Root Element: ${folder}</div>
<div class="caption">Type in Query: ${type}</div>
		
<div id="table">
	<div class="header-row row">
	 <span class="cell primary">Number</span>
     <span class="cell primary">Name</span>
     <span class="cell primary">Noderef</span>
    </div>
<#list results as res>
  <div class="row">
     <span class="cell primary" data-label="Vehicle">${res_index +1}</span>
     <span class="cell primary" data-label="Vehicle">${res.name}</span>
     <span class="cell primary" data-label="Vehicle"> ${res.nodeRef}</span>
   </div>
</#list>  
</div>

</body>
</html>

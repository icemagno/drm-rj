Ext.define('MCLM.view.ships.ShipsHUDWindow', {
	extend: 'Ext.Window',
	id:'shipsHUDWindow',    	
	xtype: 'shipsHUDWindow',
	title : "Navegação",
	width : 300,
	height: 300,
	bodyStyle:"background:#FFFFFF;",
	resizable: false,
	constrain: true,
	renderTo: Ext.getBody(),
	frame : false,
	border : false,
	html : '<img style="width:23px;position:absolute;top:7px;left:135px" src="img/compasspointer.png"><img id="imgCompass" style="position:absolute; top:15px;left:-103px;width:500px;height:500px" src="img/compass.png">' +
	'<div style="text-align:center;position:absolute;height:50px;width:50px;left:123px;top:0px" id="shipHeading"></div>' +	
	'<div style="padding:5px;border-top:1px solid #cacaca;width:290px;height:180px;background-color:white;position:absolute;bottom:0px">' +
	
	/*'<img style="position: absolute;top:30px;left:10px;width: 75px;" src="img/rudderangle.jpg">' +*/
	'<img id="rudderPointer" style="position: absolute;top:45px;left:10px;width: 45px;" src="img/rudderpointer.png">' +
	
	'<div style="text-align:center;position:absolute;top:27px;left:10px;width:50px;" id="shipRudder"></div>' +
	'<div style="text-align:center;position:absolute;top:27px;right:10px;width:50px;" id="shipSpeed"></div>' +
	
	
	'<table style="width:100%">' +
	'<tr><td colspan="3"><div id="shipPosition" style="font-weight:bold;border-bottom: 1px solid #cacaca;text-align:center;width:100%"></div></td></tr>' +
	'</table>' +
	
	'<img id="theRudder" style="position: absolute;bottom: -150px;left: 15px;" src="img/rudder.ico">' +
	'<div style="position:absolute;width:100px;height:70px;bottom:1px;right:1px;cursor:pointer" id="rudderToRight"></div>' + 
	'<div style="position:absolute;width:100px;height:70px;bottom:1px;left:1px;cursor:pointer" id="rudderToLeft"></div>' +
	'</div>',
    
});
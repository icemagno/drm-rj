Ext.define('MCLM.view.onibus.OnibusDataWindow', {
	extend: 'Ext.Window',
	id:'onibusDataWindow',    	
	xtype: 'onibusDataWindow',
	title : "Dados do Onibus",
	width : 250,
	height: 200,
	bodyStyle:"background:#FFFFFF;",
	resizable: false,
	constrain: true,
	renderTo: Ext.getBody(),

	html : '',
    
});
Ext.define('MCLM.view.draw.TextBoxWindow', {
	extend: 'Ext.Window',
	id:'textBoxWindow',    	
	xtype: 'textBoxWindow',
	title : "Caixa de Texto",
	width : 400,
	height: 195,
	bodyStyle:"background:#FFFFFF;",
	resizable: false,
	constrain: true,
	renderTo: Ext.getBody(),

	textBoxCenter : null,
	
	requires: [
	   'MCLM.view.draw.DrawToolBarController',
	   'MCLM.view.draw.TextBoxForm'
	],     
	controller : 'drawToolBar',	
	
	items: [{
		xtype: 'textBoxForm'
	}],		
	
	listeners: {
		
		close : function() {
	    	MCLM.Map.unbindMapClick();
			$("#painelCentral").css('cursor','default');
		}

	}
    
});
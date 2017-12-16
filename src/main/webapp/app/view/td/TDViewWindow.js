Ext.define('MCLM.view.td.TDViewWindow', {
	
	extend: 'Ext.Window',
	
	id:'tDViewVWindow',    	
	xtype: 'tDViewVWindow',
	title : "Visão 3D",
	width : 900,
	height: 500,
	bodyStyle:"background:#FFFFFF;",
	resizable: false,
	constrain: true,
	renderTo: Ext.getBody(),

	html : '<div style="width:900px;height:500px;float:left" id="tdMap"></div>',

	// html : '<div style="width:444px;height:500px;float:left" id="tdMap"></div><div style="width:444px;height:500px;float:right" id="ddMap"></div>',

	
	/*
    requires: [
       'MCLM.view.tools.MeasureController',
       'MCLM.view.tools.Measure',
    ],	
    controller : 'measureController',
    items: [{
        xtype: 'measure',
    }],
    */

    listeners: {

    	close : function() {
    		//
    	},
	    
	    afterrender : function ( cmp ) {
	    	//
        }
	
    },	
	
    
});
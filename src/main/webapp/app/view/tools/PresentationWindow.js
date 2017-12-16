Ext.define('MCLM.view.tools.PresentationWindow', {
	
	extend: 'Ext.Window',
	
	id:'presentationWindow',    	
	xtype: 'presentationWindow',
	title : "Controle de Apresentação",
	width : 326,
	height: 90,
	bodyStyle:"background:#FFFFFF;",
	resizable: false,
	constrain: true,
	renderTo: Ext.getBody(),

    requires: [
       'MCLM.view.tools.PresentationController',
       'MCLM.view.tools.Presentation',
    ],	
    
    controller : 'presentationController',
	
    items: [{
        xtype: 'presentation',
    }],
    
    html : '<div style="margin-left:5px; text-align:right; padding-top:3px; width:97%;border-top:1px dotted #cacaca"  id="presentationPanel">0 / 0</div>',

    listeners: {

    	close : function() {
    		MCLM.getApplication().fireEvent( "onCloseWindow");
    	},
	    
	    afterrender : function ( cmp ) {
        }
	
    },	
	
    
});
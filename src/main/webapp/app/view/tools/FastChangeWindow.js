Ext.define('MCLM.view.tools.FastChangeWindow', {
	
	extend: 'Ext.Window',
	
	id:'fastChangeWindow',    	
	xtype: 'fastChangeWindow',
	title : "Troca Rápida de Cenários",
	width : 286,
	height: 70,
	bodyStyle:"background:#FFFFFF;",
	resizable: false,
	constrain: true,
	renderTo: Ext.getBody(),

    requires: [
       'MCLM.view.tools.FastChangeController',
       'MCLM.view.tools.FastChange',
    ],	
    
    controller : 'fastChangeController',
	
    items: [{
        xtype: 'fastChange',
    }],

    listeners: {

    	close : function() {
	    	var fastChange = Ext.getCmp("fastChange");
			var buttons = fastChange.query('button');
			Ext.Array.each(buttons, function(button) {
	    		Ext.tip.QuickTipManager.unregister( button.id );
			});  	    	
    	},
	    
	    afterrender : function ( cmp ) {

	    	var fastChange = Ext.getCmp("fastChange");
			var buttons = fastChange.query('button');
			Ext.Array.each(buttons, function(button) {
				
				var data = MCLM.Globals.fastChangeSlots[ button.id ];
				if( data ) {
					console.log( button.id );
					
		    		var title = data.get('sceneryName');
		    		Ext.tip.QuickTipManager.unregister( button.id );
		    	    Ext.tip.QuickTipManager.register({
		    	        target: button.id,
		    	        title: 'Abrir Cenário',
		    	        text: 'Carrega o Cenário "' + title + '". As modificações não gravadas no Cenário atual serão perdidas.',
		    	        width: 180,
		    	        dismissDelay: 5000 
		    	    });					
					
					
				}
				
			});  	    	
	    	
	    	
        }
	
    },	
	
    
});
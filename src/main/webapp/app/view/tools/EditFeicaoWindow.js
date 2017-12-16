Ext.define('MCLM.view.tools.EditFeicaoWindow', {
	
	extend: 'Ext.Window',
	
	id:'editFeicaoWindow',    	
	xtype: 'editFeicaoWindow',
	title : "Editar Feição",
	width : 280,
	height: 70,
	bodyStyle:"background:#FFFFFF;",
	resizable: false,
	constrain: true,
	renderTo: Ext.getBody(),

	
    requires: [
       'MCLM.view.tools.EditFeicao',
       'MCLM.view.tools.EditFeicaoController',
    ],	
    controller : 'editFeicaoController',
    
	
    items: [{
        xtype: 'editFeicao',
    }],

    listeners: {

    	close : function() {
    		Ext.tip.QuickTipManager.unregister('saveFeicaoID');    	
    		Ext.tip.QuickTipManager.unregister('cancelEditFeicaoID');
    		MCLM.Map.cancelEditFeicao();
    	},
	    
	    afterrender : function ( cmp ) {
        	
    	    Ext.tip.QuickTipManager.register({
    	        target: 'saveFeicaoID',
    	        title: 'Salvar',
    	        text: 'Salvar as modificações na Feição em edição.',
    	        width: 180,
    	        dismissDelay: 5000 
    	    },{
    	        target: 'cancelEditFeicaoID',
    	        title: 'Cancelar',
    	        text: 'Cancela as modificações feitas na Feição sendo editada.',
    	        width: 180,
    	        dismissDelay: 5000 
    	    });
        	
        }
	
    },	
	
    
});
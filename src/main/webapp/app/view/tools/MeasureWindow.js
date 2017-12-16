Ext.define('MCLM.view.tools.MeasureWindow', {
	
	extend: 'Ext.Window',
	
	id:'measureWindow',    	
	xtype: 'measureWindow',
	title : "Ferramentas de Medição",
	width : 190,
	height: 70,
	bodyStyle:"background:#FFFFFF;",
	resizable: false,
	constrain: true,
	renderTo: Ext.getBody(),

    requires: [
       'MCLM.view.tools.MeasureController',
       'MCLM.view.tools.Measure',
    ],	
    
    controller : 'measureController',
	
    items: [{
        xtype: 'measure',
    }],

    listeners: {

    	close : function() {
    		MCLM.MeasureHelper.removeTool();
    		
	    	var measure = Ext.getCmp("measure");
			var buttons = measure.query('button');
			Ext.Array.each(buttons, function(button) {
	    		Ext.tip.QuickTipManager.unregister( button.id );
			}); 
			
    	},
	    
	    afterrender : function ( cmp ) {
	    	
    	    Ext.tip.QuickTipManager.register({
    	        target: 'initAreaID',
    	        title: 'Medir uma área',
    	        text: 'Permite desenhar uma área a ser medida no mapa.',
    	        width: 150,
    	        dismissDelay: 5000 
    	    },{
    	        target: 'initLineID',
    	        title: 'Medir uma linha',
    	        text: 'Permite desenhar uma linha a ser medida no mapa.',
    	        width: 150,
    	        dismissDelay: 5000 
    	    },{
    	        target: 'initCircleID',
    	        title: 'Medir um círculo',
    	        text: 'Permite desenhar um círculo a ser medido no mapa.',
    	        width: 150,
    	        dismissDelay: 5000 
    	    }/*,{
    	        target: 'queryFeicaoID',
    	        title: 'Interrogar uma Feição',
    	        text: 'Verifica as medidas de uma Feição tipo Linha ou Área.',
    	        width: 150,
    	        dismissDelay: 5000 
    	    }*/,{
    	        target: 'reloadToolID',
    	        title: 'Apagar Medições',
    	        text: 'Apaga as medições no mapa e reinicia a ferramenta.',
    	        width: 150,
    	        dismissDelay: 5000 
    	    });
    	    
        }
	
    },	
	
    
});
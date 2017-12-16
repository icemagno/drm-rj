Ext.define('MCLM.view.tools.MeasureController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.measureController',

    initArea: function( button ) {
    	this.releaseAll( button );
    	MCLM.MeasureHelper.init('Polygon');
    },
    
    initCircle : function( button ) {
    	this.releaseAll( button );
    	MCLM.MeasureHelper.init('Circle');    	
    },
    
    initLine : function( button ) {
    	this.releaseAll( button );
    	MCLM.MeasureHelper.init('LineString');
    },
    
    queryFeicao : function( button ) {
    	this.releaseAll( button );
    	alert('Não implementado ainda');
    },
    
    reloadTool : function(button){
    	this.releaseAll( button );
    	MCLM.MeasureHelper.removeTool();
    },
    
    releaseAll : function( exceptButton ) {
    	var measure = Ext.getCmp("measure");
		var buttons = measure.query('button');
		Ext.Array.each(buttons, function(button) {
			if ( button.id != exceptButton.id )  button.toggle(false);
		});    
    },    
    

});
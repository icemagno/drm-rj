Ext.define('MCLM.view.cenarios.SaveCenarioWindow', {
	extend: 'Ext.Window',
	xtype : 'view.saveCenarioWindow',
	id : 'saveCenarioWindow',

	
    requires: [
        'MCLM.view.cenarios.SaveCenarioController',
        'MCLM.view.cenarios.SaveCenarioForm',
	],	    
    controller : 'savecenario',	
	
	
	width : 500,
	height: 170,
    scrollable: false,
    frame : false,
	layout : 'border',
	title : "Salvar Cenário",
	constrain: true,
	
	renderTo: Ext.getBody(),
	
	items: [{
		xtype: 'view.saveCenarioForm'
	}],	
	  

});

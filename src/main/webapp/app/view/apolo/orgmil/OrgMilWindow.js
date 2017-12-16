Ext.define('MCLM.view.apolo.orgmil.OrgMilWindow', {
	extend: 'Ext.Window',
	xtype : 'orgMilWindow',
	id : 'orgMilWindow',
	
	title : "Organização",

    requires: [
      'MCLM.view.apolo.orgmil.OrgMilTabContainer',
      'MCLM.view.apolo.orgmil.OrgMilController',
	],		
	
	controller : 'orgMilController',
	
	geometry : null,
	
	
	width : 890,
	height: 500,
	layout : 'border',
	resizable: false,
	scrollable: false,

	frame : false,
    constrain: true,
    bodyStyle:"background:#FFFFFF;",
    renderTo: Ext.getBody(),
	bodyPadding: 0,
	
    items: [{
        xtype: 'orgMilTabContainer'
    }],

    dockedItems: [{
        xtype: 'toolbar',
        items: [{
        	iconCls: 'owm-rain-icon',
        	id: 'ttt1',
            handler : 'getMetarTaf'
        },{
        	iconCls: 'owm-wind-icon',
        	id: 'ttt2',
            handler : 'teste'
        }]
    }]
    
    
	

});

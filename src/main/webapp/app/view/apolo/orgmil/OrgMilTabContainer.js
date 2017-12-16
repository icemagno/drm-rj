Ext.define('MCLM.view.apolo.orgmil.OrgMilTabContainer', {
	extend: 'Ext.tab.Panel',
	xtype : 'orgMilTabContainer',
	id : 'orgMilTabContainer',

	layoutOnTabChange: true, 
	deferredRender: false,
	plain: true,

	region: 'center',
	defaults:{ autoScroll:true, border: false, frame: false },
	
	items: [],

    listeners: {
    	
        'afterrender' : function ( cmp ) {
        	//
        }

    }    	
});

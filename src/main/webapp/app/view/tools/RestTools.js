Ext.define('MCLM.view.tools.RestTools', {
	
	extend: 'Ext.toolbar.Toolbar',
	
	id:'restTools',    	
	xtype: 'restTools',

    border : false,
    style: {
        background: '#FFFFFF'
    }, 
    
    items: [{
	    iconCls: 'tdview-icon',
	    width: MCLM.Globals.btnWidth,
	    height: MCLM.Globals.btnHeight,
	    handler: 'show3dView',
	    enableToggle: true,
        id : 'tdviewID',
        xtype: 'button',
    }/*,{
	    iconCls: 'ship-icon',
	    enableToggle: true,
	    width: MCLM.Globals.btnWidth,
	    height: MCLM.Globals.btnHeight,
	    handler: 'updateMaritmTraffic',
        id : 'maritmTrID',
        xtype: 'button',
    }*/,{
	    iconCls: 'ship-icon',
	    width: MCLM.Globals.btnWidth,
	    height: MCLM.Globals.btnHeight,
	    handler: 'shoMarineTraffic',
        id : 'marineTrafficID',
        xtype: 'button',
    }/*,{
	    iconCls: 'photo-icon',
	    enableToggle: true,
	    width: MCLM.Globals.btnWidth,
	    height: MCLM.Globals.btnHeight,
	    handler: 'showStreetPhoto',
        id : 'photoID',
        xtype: 'button',
    }*/,{
    	iconCls: 'onibus-icon',
	    width: MCLM.Globals.btnWidth,
	    height: MCLM.Globals.btnHeight,
    	xtype: 'button',
    	id: 'rioOnibusID',
    	enableToggle: true,
        handler : 'rioOnibus'
    }],

	
});
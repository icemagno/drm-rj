Ext.define('MCLM.view.tools.Presentation', {
	
	extend: 'Ext.toolbar.Toolbar',
	
	id:'presentation',    	
	xtype: 'presentation',

    border : false,
    style: {
        background: '#FFFFFF'
    }, 
    
    items: [{
	    iconCls: 'first-icon',
        handler: 'first',
	    width: MCLM.Globals.btnWidth,
	    height: MCLM.Globals.btnHeight,
	    id : 'firstId',
        xtype: 'button',
        
    },{
	    iconCls: 'previous-icon',
        handler: 'previous',
	    width: MCLM.Globals.btnWidth,
	    height: MCLM.Globals.btnHeight,
	    id : 'previousId',
        xtype: 'button',
        
    },{
	    iconCls: 'record-icon',
        handler: 'record',
	    width: MCLM.Globals.btnWidth,
	    height: MCLM.Globals.btnHeight,
	    id : 'recordId',
        xtype: 'button',
        
    },{
	    iconCls: 'play-icon',
        handler: 'play',
	    width: MCLM.Globals.btnWidth,
	    height: MCLM.Globals.btnHeight,
	    id : 'playId',
	    enableToggle: true,
        xtype: 'button',
        
    },{
	    iconCls: 'stop-icon',
        handler: 'stop',
	    width: MCLM.Globals.btnWidth,
	    height: MCLM.Globals.btnHeight,
	    id : 'stopId',
        xtype: 'button',
        
    },{
	    iconCls: 'pause-icon',
        handler: 'pause',
	    width: MCLM.Globals.btnWidth,
	    height: MCLM.Globals.btnHeight,
	    enableToggle: true,
	    id : 'pauseId',
        xtype: 'button',
        
    },{
	    iconCls: 'next-pres-icon',
        handler: 'next',
	    width: MCLM.Globals.btnWidth,
	    height: MCLM.Globals.btnHeight,
	    id : 'nextId',
        xtype: 'button',
        
    },{
	    iconCls: 'last-icon',
        handler: 'last',
	    width: MCLM.Globals.btnWidth,
	    height: MCLM.Globals.btnHeight,
	    id : 'lastId',
        xtype: 'button',
        
    },{
	    iconCls: 'flush-icon',
        handler: 'flush',
	    width: MCLM.Globals.btnWidth,
	    height: MCLM.Globals.btnHeight,
	    id : 'flushId',
        xtype: 'button',
        
    }],

	
});
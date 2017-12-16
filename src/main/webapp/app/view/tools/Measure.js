Ext.define('MCLM.view.tools.Measure', {
	
	extend: 'Ext.toolbar.Toolbar',
	
	id:'measure',    	
	xtype: 'measure',

    border : false,
    style: {
        background: '#FFFFFF'
    }, 
    
    items: [{
	    iconCls: 'fei-icon',
        handler: 'initArea',
	    width: MCLM.Globals.btnWidth,
	    height: MCLM.Globals.btnHeight,
	    enableToggle: true,
	    id : 'initAreaID',
        xtype: 'button',
        
    },{
	    iconCls: 'circle-tool',
        handler: 'initCircle',
	    width: MCLM.Globals.btnWidth,
	    height: MCLM.Globals.btnHeight,
	    enableToggle: true,
	    id : 'initCircleID',
        xtype: 'button',
        
    },{
	    iconCls: 'line-tool',
        handler: 'initLine',
	    width: MCLM.Globals.btnWidth,
	    height: MCLM.Globals.btnHeight,
	    enableToggle: true,
	    id : 'initLineID',
        xtype: 'button',
        
    }/*,{
	    iconCls: 'query-icon',
        handler: 'queryFeicao',
	    width: MCLM.Globals.btnWidth,
	    height: MCLM.Globals.btnHeight,
	    enableToggle: true,
	    id : 'queryFeicaoID',
        xtype: 'button',
        
    }*/,{
	    iconCls: 'reload-icon',
        handler: 'reloadTool',
	    width: MCLM.Globals.btnWidth,
	    height: MCLM.Globals.btnHeight,
	    id : 'reloadToolID',
        xtype: 'button',
        
    }],

	
});
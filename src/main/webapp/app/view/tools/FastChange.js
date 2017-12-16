Ext.define('MCLM.view.tools.FastChange', {
	
	extend: 'Ext.toolbar.Toolbar',
	
	id:'fastChange',    	
	xtype: 'fastChange',

    border : false,
    style: {
        background: '#FFFFFF'
    }, 
    
    items: [{
	    iconCls: 'one-icon',
        handler: 'loadOne',
	    width: MCLM.Globals.btnWidth,
	    height: MCLM.Globals.btnHeight,
	    id : 'loadOneId',
        xtype: 'button',
        
    },{
	    iconCls: 'two-icon',
        handler: 'loadTwo',
	    width: MCLM.Globals.btnWidth,
	    height: MCLM.Globals.btnHeight,
	    id : 'loadTwoId',
        xtype: 'button',
        
    },{
	    iconCls: 'three-icon',
        handler: 'loadThree',
	    width: MCLM.Globals.btnWidth,
	    height: MCLM.Globals.btnHeight,
	    id : 'loadThreeId',
        xtype: 'button',
        
    },{
	    iconCls: 'four-icon',
        handler: 'loadFour',
	    width: MCLM.Globals.btnWidth,
	    height: MCLM.Globals.btnHeight,
	    id : 'loadFourId',
        xtype: 'button',
        
    },{
	    iconCls: 'five-icon',
        handler: 'loadFive',
	    width: MCLM.Globals.btnWidth,
	    height: MCLM.Globals.btnHeight,
	    id : 'loadFiveId',
        xtype: 'button',
        
    },{
	    iconCls: 'six-icon',
        handler: 'loadSix',
	    width: MCLM.Globals.btnWidth,
	    height: MCLM.Globals.btnHeight,
	    id : 'loadSixId',
        xtype: 'button',
        
    },{
	    iconCls: 'seven-icon',
        handler: 'loadSeven',
	    width: MCLM.Globals.btnWidth,
	    height: MCLM.Globals.btnHeight,
	    id : 'loadSevenId',
        xtype: 'button',
        
    },{
	    iconCls: 'eight-icon',
        handler: 'loadEight',
	    width: MCLM.Globals.btnWidth,
	    height: MCLM.Globals.btnHeight,
	    id : 'loadEightId',
        xtype: 'button',
        
    }],

	
});
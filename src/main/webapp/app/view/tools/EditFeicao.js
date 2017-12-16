Ext.define('MCLM.view.tools.EditFeicao', {
	
	extend: 'Ext.toolbar.Toolbar',
	
	id:'editFeicao',    	
	xtype: 'editFeicao',

    border : false,
    style: {
        background: '#FFFFFF'
    }, 
    
    items: [{
	    iconCls: 'save-icon',
	    width: MCLM.Globals.btnWidth,
	    height: MCLM.Globals.btnHeight,
	    handler: 'saveFeicao',
        id : 'saveFeicaoID',
        xtype: 'button',
    },{
	    iconCls: 'cancel-icon',
	    width: MCLM.Globals.btnWidth,
	    height: MCLM.Globals.btnHeight,
	    handler: 'cancelEditFeicao',
        id : 'cancelEditFeicaoID',
        xtype: 'button',
    },{
		xtype: 'combobox',
		editable : false,
		name: 'idFeicaoStyle',
		labelWidth: 30,
		fieldLabel: 'Estilo:',
		displayField: 'featureStyleName',	    	
		id: 'idFeicaoStyle',
		store: 'store.styles',	    	
	    forceSelection: true,
	    allowBlank: false,
	    valueField: 'idFeatureStyle',
	    
	    listeners : {
	    	select : function( ele, rec, idx ) {
	        	MCLM.Map.editFeicaoStyle = rec.data;
	        	MCLM.Map.editingFromSource.changed();
	    	}
	    } 
    
    
	 }],

	
});
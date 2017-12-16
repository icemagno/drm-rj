Ext.define('MCLM.view.cenarios.CenarioGrid', {
	extend: 'Ext.grid.Panel',
	xtype: 'cenarioGrid',
	id: 'cenarioGrid',
	border: true,
	title : '',
	store : 'store.Scenery', 
    frame: false,
    margin: "0 0 0 0", 
    flex:1,
    loadMask: true,
    columns:[
   	     {text:'', dataIndex:'isPublic', width:30, renderer: function(value) {
   	    	if ( value ) {
   	    		return '<img style="width:15px;height:15px" src="img/public.svg" />';
   	    	} else {
   	    		return '<img style="width:15px;height:15px" src="img/private.svg" />';
   	    	}
   	     }},
	     {text:'Nome', dataIndex:'sceneryName', width:200},
	     {text:'Descrição', dataIndex:'description', width:300},
    ],
    listeners: {
    	// atualiza a janela de preview com a camada selecionada na lista
        rowclick: function(grid, record, tr, rowIndex, e, eOpts) {
        	// Interceptado pelo controller MCLM.view.cenarios.CenarioController'
        },
        
        
        itemcontextmenu : function(tree, record, item, index, e, eOpts ) {
        	var me = MCLM.Functions;
		    var menu_grid = new Ext.menu.Menu({ 
		    	items: [
		          { iconCls: 'one-icon', text: 'Acessar pelo botão 1', handler: function() { me.saveToSlot(record,'loadOneId'); } },
		          { iconCls: 'two-icon', text: 'Acessar pelo botão 2', handler: function() { me.saveToSlot(record,'loadTwoId'); } },
		          { iconCls: 'three-icon', text: 'Acessar pelo botão 3', handler: function() { me.saveToSlot(record,'loadThreeId'); } },
		          { iconCls: 'four-icon', text: 'Acessar pelo botão 4', handler: function() { me.saveToSlot(record,'loadFourId'); } },
		          { iconCls: 'five-icon', text: 'Acessar pelo botão 5', handler: function() { me.saveToSlot(record,'loadFiveId'); } },
		          { iconCls: 'six-icon', text: 'Acessar pelo botão 6', handler: function() { me.saveToSlot(record,'loadSixId'); } },
		          { iconCls: 'seven-icon', text: 'Acessar pelo botão 7', handler: function() { me.saveToSlot(record,'loadSevenId'); } },
		          { iconCls: 'eight-icon', text: 'Acessar pelo botão 8', handler: function() { me.saveToSlot(record,'loadEightId'); } },
		        ]
		    });
        	
			var position = e.getXY();
			e.stopEvent();
			menu_grid.showAt(position);        	
        	
        },
        
		afterrender:function(){
			
		    Ext.tip.QuickTipManager.register({
		        target: 'id300',
		        title: 'Tornar Público',
		        text: 'Torna público o Cenário selecionado.',
		        width: 150,
		        dismissDelay: 5000 
		    }, {
		        target: 'id301',
		        title: 'Tornar Privado',
		        text: 'Torna privado o Cenário selecionado.',
		        width: 150,
		        dismissDelay: 5000 
		    }, {
		        target: 'id302',
		        title: 'Apagar Cenário',
		        text: 'Apaga definitivamente o Cenário selecionado.',
		        width: 150,
		        dismissDelay: 5000 
		    },{
		        target: 'id303',
		        title: 'Carregar Cenário',
		        text: 'Recupera um cenário. O conteúdo atual será apagado.',
		        width: 150,
		        dismissDelay: 5000 
		    },{
		        target: 'id304',
		        title: 'Salvar Cenário como...',
		        text: 'Salva uma cópia do cenário selecionado.',
		        width: 150,
		        dismissDelay: 5000 
		    });			
			
		},        
    },	 
    
    
    dockedItems: [{
        xtype: 'toolbar',
        items: [{
        	iconCls: 'delete-icon',
        	id: 'id302',
            handler : 'deleteScenery'
        },{
        	xtype: 'tbseparator'
        },{
        	iconCls: 'scenery-public',
        	id: 'id300',
            handler : 'makeSceneryPublic'
        },{
        	iconCls: 'scenery-private',
        	id: 'id301',
            handler : 'makeSceneryPrivate'
        },{
        	xtype: 'tbseparator'
        },{
        	iconCls: 'copy-icon',
        	id: 'id304',
            handler : 'cloneScenery'
        },{
        	iconCls: 'loadscenery-icon',
        	id: 'id303',
            handler : 'loadScenery'
        }]
    }],    
    
});	


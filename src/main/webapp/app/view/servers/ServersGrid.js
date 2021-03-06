Ext.define('MCLM.view.servers.ServersGrid', {
	extend: 'Ext.grid.Panel',
	xtype: 'serversGrid',
	id: 'serversGrid',
	border: true,
	title : 'Fontes Externas - Geoserver',
	store : 'store.externalsource', 
    frame: false,
    margin: "0 0 0 0", 
    flex:1,
    loadMask: true,
    autoScroll: true,
    columns:[
	     {text:'Nome', dataIndex:'name', width:200,editor: 'textfield'},
	     {text:'Endereço', dataIndex:'url', width:300,editor: 'textfield'},
	     {text:'Versão', dataIndex:'version', width:70,editor: 'textfield'}
    ],
    
    selType: 'cellmodel',
    plugins: {
        ptype: 'cellediting',
        clicksToEdit: 2
    },
    
    
    dockedItems: [{
        xtype: 'toolbar',
        items: [{
        	iconCls: 'add-external-icon',
        	id: 'id311',
            handler : 'addExternalSource'
        }, {
        	iconCls: 'remove-external-icon',
        	id: 'id312',
            handler : 'askDeleteExternalSource'
        }]
    }],		
    
	listeners:{
		
		edit : function( a, b) {
			
	    	var layerTree = Ext.getCmp('layerTree');
			var rootMaintree = layerTree.getRootNode();
			
	  		var layerTreeStore = Ext.getStore('store.layerTree');
	  		layerTreeStore.load( { node: rootMaintree } );	
	  		
		},		
	
		
		afterrender:function(){
			
		    Ext.tip.QuickTipManager.register({
		        target: 'id311',
		        title: 'Adicionar Fonte Externa Geoserver ',
		        text: 'Cadastra um novo servidor GeoServer para servir como fonte de camadas.',
		        width: 250,
		        dismissDelay: 5000 
		    },{
		        target: 'id312',
		        title: 'Remover Fonte Externa Geoserver',
		        text: 'Remove a Fonte Externa selecionada.',
		        width: 150,
		        dismissDelay: 5000 
		    });			
			
		}
	},     
});	
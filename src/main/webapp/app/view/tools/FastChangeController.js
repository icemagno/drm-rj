Ext.define('MCLM.view.tools.FastChangeController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.fastChangeController',

    currentSlot : null,
    
    releaseAll : function( exceptButton ) {
    	
    	var fastChange = Ext.getCmp("fastChange");
		var buttons = fastChange.query('button');
		Ext.Array.each(buttons, function(button) {
			if ( button.id != exceptButton.id )  button.toggle(false);
		});    
		
		this.currentSlot = exceptButton;
		
		if ( MCLM.Globals.fastChangeSlots[ exceptButton.id ] ) {
	    	MCLM.Globals.currentSceneryData = MCLM.Globals.fastChangeSlots[ exceptButton.id ];
	    	MCLM.Globals.currentScenery = MCLM.Globals.currentSceneryData.get('idScenery');
	    	this.loadScenery();
		}
		
		
    },

    loadOne : function( button ) {
    	this.releaseAll( button );
    	console.log( MCLM.Globals.fastChangeSlots[ button.id ] );
    },
    loadTwo : function( button ) {
    	this.releaseAll( button );
    	console.log( MCLM.Globals.fastChangeSlots[ button.id ] );
    },
    loadThree : function( button ) {
    	this.releaseAll( button );
    	console.log( MCLM.Globals.fastChangeSlots[ button.id ] );
    },
    loadFour : function( button ) {
    	this.releaseAll( button );
    	console.log( MCLM.Globals.fastChangeSlots[ button.id ] );
    },
    loadFive : function( button ) {
    	this.releaseAll( button );
    	console.log( MCLM.Globals.fastChangeSlots[ button.id ] );
    },
    loadSix : function( button ) {
    	this.releaseAll( button );
    	console.log( MCLM.Globals.fastChangeSlots[ button.id ] );
    },
    loadSeven : function( button ) {
    	this.releaseAll( button );
    	console.log( MCLM.Globals.fastChangeSlots[ button.id ] );
    },
    loadEight : function( button ) {
    	this.releaseAll( button );
    	console.log( MCLM.Globals.fastChangeSlots[ button.id ] );
    },
    
    
    loadScenery : function() {
		var row = MCLM.Globals.currentSceneryData;
		var currentScenery = MCLM.Globals.currentScenery;
		
		var sceneryName = row.get('sceneryName');
		var zoomLevel = row.get('zoomLevel');
		var mapCenter = row.get('mapCenter');
		var graticule = row.get('graticule');

		this.fireEvent('doClearWorkspace');
		// Interceptado por 'MCLM.view.paineis.LayerTreeController'
		this.fireEvent( "clearMainTree");	    	
    	
		MCLM.Map.setMapGridVisibility( graticule );
		
		// doClearWorkspace() limpou. Seta novamente.
		MCLM.Globals.currentSceneryData = row;
		MCLM.Globals.currentScenery = currentScenery;
		
		
		var trabalhoTreeStore = Ext.getStore('store.trabalhoTree');
		trabalhoTreeStore.load({
			params:{cenario: currentScenery},
		    callback: function(records, operation, success) {
		    	if ( success ) {
		        	// Mudar o titulo do no raiz para o nome do cenario
		    		var tree = Ext.getCmp('trabalhoTree');
		    		var root = tree.getRootNode();
		    		
			    	var painelEsquerdo = Ext.getCmp('painelesquerdo');
			    	painelEsquerdo.setTitle(sceneryName);		    		
		    		
		    		if( root ) {
		    			root.data.text = sceneryName;
		    			root.collapse();
		    			tree.expandAll();
		    		}
		    		MCLM.Map.panTo( mapCenter, zoomLevel );
		    		
		    		var cloneSceneryButton = Ext.getCmp('svCenaryAsBtn'); 
		    		cloneSceneryButton.enable();
		    		
		    	}
		    }
		});  
		
    	
    },
    
    
    
});
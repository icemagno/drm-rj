Ext.define('MCLM.view.tools.PresentationController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.presentationController',

    listen : {
        controller : {
            '*' : { 
            	onCloseWindow : 'onCloseWindow'
            }
        }
    },  
        
    
    
    totalFrames : 0,
    currentFrame : 0,
    frames : [],
    speed : 3500,
    status : 'stopped',
    defaultLayers : [],
    
	first : function() {
		if ( this.frames.length == 0 ) return true;
		
		this.currentFrame = 1;
		this.updatePanel();
		this.move();
	},
    
	previous : function() {
		if ( this.frames.length == 0 ) return true;
		
		if ( this.currentFrame < 2 ) return true;
		this.currentFrame--;
		this.updatePanel();
		this.move();
	},	
    
	next : function() {
		if ( this.frames.length == 0 ) return true;
		
		if ( this.currentFrame == this.totalFrames ) return true;
		this.currentFrame++;
		this.updatePanel();
		this.move();
	},
	
	last : function() {
		if ( this.frames.length == 0 ) return true;
		
		this.currentFrame = this.totalFrames;
		this.updatePanel();
		this.move();
	},
	
    record : function() {
    	if ( this.status == 'playing' ) return true;
    	
    	var pauseBtn = Ext.getCmp("pauseId");
    	pauseBtn.toggle(false);    	
    	
		var playBtn = Ext.getCmp("playId");
    	playBtn.toggle(false);    	
    	
    	this.storeFrame();
    },
    
    pause : function() {
    	if ( this.frames.length == 0 ) return true;
    	
		if ( this.status == 'stopped' ) {
	    	var pauseBtn = Ext.getCmp("pauseId");
	    	pauseBtn.toggle(false);
			return true;
		}
    	
    	if ( this.status == 'paused' ) {
    		var playBtn = Ext.getCmp("playId");
        	playBtn.toggle(true);
    		this.status = 'playing';
    	} else 	if ( this.status == 'playing' ) {
    		var playBtn = Ext.getCmp("playId");
        	playBtn.toggle(false);
    		this.status = 'paused';
    	}
    	
    },
    
    stop : function() {
    	if ( this.frames.length == 0 ) return true;
    	
    	this.first();
    	
    	if ( !this.runningFunction ) return true;
    	clearInterval( this.runningFunction );
    	this.status = 'stopped';

    	var pauseBtn = Ext.getCmp("pauseId");
    	pauseBtn.toggle(false);
    	
		var playBtn = Ext.getCmp("playId");
    	playBtn.toggle(false); 	
    	
    },
    
    play : function() {

    	if ( this.frames.length == 0 ) return true;
    	
    	if ( this.status == 'playing' ) {
        	var pauseBtn = Ext.getCmp("pauseId");
        	pauseBtn.toggle(true);    		
    		this.status = 'paused';
    		return true;
    	}     	
    	
    	if ( this.status == 'paused' ) {
        	var pauseBtn = Ext.getCmp("pauseId");
        	pauseBtn.toggle(false);    		
    		this.status = 'playing';
    		return true;
    	}     	
    	

    	var me = this;
    	this.status = 'playing';
    	me.walkAhead();
    	this.runningFunction = setInterval( function(){ me.walkAhead(); }, this.speed );
    	
    	var pauseBtn = Ext.getCmp("pauseId");
    	pauseBtn.toggle(false);
    	
    },


	updatePanel : function() {
		$("#presentationPanel").text( this.currentFrame + " / " + this.totalFrames );
	},
	
	flush : function() {
		if ( this.frames.length == 0 ) return true;
		this.stop();
		MCLM.Map.toDefault();
		this.currentFrame = 0;
		this.totalFrames = 0;
		this.frames = [];
		this.speed = 3500;
		this.updatePanel();
		this.checkLayers( this.defaultLayers );
		this.defaultLayers = [];
	},
	

	walkAhead : function() {
		if ( this.frames.length == 0 ) return true;
		
		if ( this.status != 'playing' ) return true;
		this.currentFrame++
		if ( this.currentFrame > this.totalFrames ) {
			this.currentFrame = 1;
		}  
		this.move();
	},
	
	
	move : function() {
		if ( this.frames.length == 0 ) return true;
		var frame = this.frames[ this.currentFrame ];
		
		if ( frame ) {
			
			MCLM.Map.theView.animate({
				  zoom		: frame.zoom,
				  center	: frame.center,
				  duration	: 2000,
			});
			this.checkLayers( frame.activeLayers );
			
		}
		
		this.updatePanel();
		
		
	},
	
	checkLayers : function( referenceList ) {
		var me = this;
		
		// Adiciona no mapa as camadas que estão no Frame mas não estão no mapa.
		for( x=0; x < referenceList.length; x++  ) {
			var layer = referenceList[x];	
			var foundLayer = null;				
			MCLM.Map.getLayers().forEach( function ( mapLayer ) {
				
				if( mapLayer.get('name') == layer.get('name') ) {
					foundLayer = mapLayer;
				} 
			
			});
			if( foundLayer ) {
				foundLayer.setVisible( true );
			} else {
				MCLM.Map.map.addLayer( layer );
			}
		}
		// Remove do mapa as camadas que estão no mapa mas não estão no Frame
		MCLM.Map.getLayers().forEach( function ( mapLayer ) {
			if ( mapLayer ) {
				var foundLayer = mapLayer;
				for( x=0; x < referenceList.length; x++  ) {
					var layer = referenceList[x];
					if( mapLayer.get('name') == layer.get('name') ) {
						foundLayer = null;
					} 
				}
				
				if( foundLayer ) {
					//foundLayer.setVisible(false);
					MCLM.Map.map.removeLayer( foundLayer );
					//console.log('Opa! Achei uma camada que não deveria estar no mapa: ' + foundLayer.get('name') );
				}
			}
		});
		
		
	},
	
	storeFrame : function( center, zoom ) {
		var me = this;
		var center = MCLM.Map.map.getView().getCenter();
		var mapZoom = MCLM.Map.map.getView().getZoom();
		var mapLayers = MCLM.Map.getLayers();

		// Grava o estado atual do mapa para restaurar as camadas originais
		if ( this.totalFrames == 0 ) {
			mapLayers.forEach( function ( layer ) {
				me.defaultLayers.push( layer );
			});				
		}
		
		this.totalFrames++;
		this.currentFrame++;
		
		var frame = {};
		frame.center = center;
		frame.zoom = mapZoom;
		frame.activeLayers = [];
		
		
		mapLayers.forEach( function ( layer ) {
			frame.activeLayers.push( layer );
		});		
		
		this.frames[ this.currentFrame ] = frame;
		this.updatePanel();
	},
	
	onCloseWindow : function() {
		this.flush();
	}
    
});
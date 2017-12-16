Ext.define("MCLM.view.ships.ShipsHelper", {
    xtype: 'shipsHelper',
    id: 'shipsHelper',
    
    mapLayerGeoCode: null,
    vectorSourceMarker: null,
    vectorLayerMarker: null,
    vectorSource : null,
    activeShipsLayer : null,
    rudderLimit : 5,

    currentRudder : 0,
    
    toRight : function() {
		if( this.currentRudder < this.rudderLimit ) this.currentRudder++;
		this.commandRudder();
    },
    
    toLeft : function() {
		if( this.currentRudder > -this.rudderLimit ) this.currentRudder--;
		this.commandRudder();
    },
    
    commandRudder : function() {
    	
    	var angle = this.currentRudder * 2;
    	
		var rdrDegVal = 90 + angle;
		var rdrDegree = "rotate(" + rdrDegVal + "deg)";
		$("#theRudder").css("transform",rdrDegree);
   			
		Ext.Ajax.request({
            url: 'commandVessel',
			params: {
				'value': this.currentRudder,
				'command':'TRN'
			},       
            failure: function (response, opts) {
            	//
            },
            success: function (response, opts) {
            	//
            }
		});
    },
    
    init: function () {

    	startWebSocket( this );
    	
    	this.vectorSource = new ol.source.Vector();
    	var me = this;
    	
    	var customStyleFunction = function( feature, resolution ) {
    		var props = feature.getProperties();
    		var bearing = props.direcao;//props.course;
    		
    		//var shipName = props.shipName;
    		//var speed = props.speed;
    		//var imo = props.imo;
    		var resultStyles = [];
    		
        	var shipsStyle = new ol.style.Style({
    			image: new ol.style.Icon(({
    				scale : 0.6,
    				anchor: [0.5, 0.5],
    				rotation : bearing * 0.01745329251,
    				anchorXUnits: 'fraction',
    				anchorYUnits: 'fraction',
    				opacity: 1.0,
    				src: 'img/ship.png'
    			}))/*,
			      text: new ol.style.Text({
			          font: '10px Consolas',
			          textAlign: 'center',
			          scale : 0.8,
			          offsetX: 0,
			          offsetY: 15,
			          textBaseline: 'middle',
			          fill: new ol.style.Fill({ color: '#000' }),
			          stroke: new ol.style.Stroke({
			            color: '#FFFFFF', width: 1
			          }),
			          text: shipName,
			        })*/    			
        	});	 
        	
        	resultStyles.push( shipsStyle );
        	return resultStyles;
    	}
    	
	    	
    	
    	this.activeShipsLayer = new ol.layer.Vector({
			source: this.vectorSource,
			style: customStyleFunction
		});			
		
    	this.activeShipsLayer.set('name', 'shipsLayer');
    	this.activeShipsLayer.set('alias', 'shipsLayer');
    	this.activeShipsLayer.set('layerType', 'FEI');
    	this.activeShipsLayer.set('serialId', 'shipsLayer');
    	this.activeShipsLayer.set('baseLayer', false);
    	this.activeShipsLayer.set('ready', true);  
		
		MCLM.Map.removeLayerByName('shipsLayer');
		MCLM.Map.map.addLayer( this.activeShipsLayer );		
		
		var data = {};
		data.description = 'Navegação';
		data.institute = 'www.cmabreu.com.br';
		data.layerName = 'shipsLayer';
		data.layerAlias = 'shipsLayer';
		data.serialId = 'shipsLayer';
		data.layerType = 'External';
		MCLM.Map.addToLayerStack( data );

    },

    deleteShips : function() {
    	var features = this.vectorSource.getFeatures();
    	for ( x=0; x < features.length; x++ ) {
    		var feature = features[x];
   			this.vectorSource.removeFeature( feature );
    	}
    },	
	
    updateLayer : function( response ) {
    	var me = this;
    	var result = Ext.decode(response);
    	
    	var feicao = {};
    	feicao["type"] = "FeatureCollection";
    	var features = [];
    	
		var properties = {};
		var feature = {};
		var coordinates = [];
		
			properties["latitude"] = result.latitude;
			properties["longitude"] = result.longitude;
			properties["velocidade"] = result.speed;
			properties["direcao"] = result.heading;        		
			properties["rudder"] = result.rudder;

			var degree = "rotate(" + result.heading + "deg)";
			$("#imgCompass").css("transform",degree);
			
			var rudderAnglePos = result.rudder * 4;
			var rudderAngle = "rotate(" + -rudderAnglePos + "deg)";
			$("#rudderPointer").css("transform",rudderAngle);
			
			
			var position = [result.longitude, result.latitude];
			var coord = ol.coordinate.toStringHDMS( position );
			$("#shipPosition").text( coord );
			
			var rr = "BE";
			var rv = result.rudder;
			if ( result.rudder == 0 ) {
				rr = "CE";
			}
			if ( result.rudder < 0 ) {
   			var rr = "BB";
   			var rv = -result.rudder;
			} 
			
			$("#shipRudder").text( rv + "º " + rr );
			$("#shipHeading").text( result.heading + "º" );
			$("#shipSpeed").text( result.speed + "kt" );

		coordinates[1] = result.latitude; 
		coordinates[0] = result.longitude;
			
		var geometry = {};
		geometry["type"] = "Point";
		geometry["coordinates"] = coordinates;       			
			
		feature["geometry"] = geometry;
		feature["type"] = "Feature";
		feature["properties"] = properties;            			
		
		features.push( feature );       			
			
		feicao["features"] = features;

    	
		var features = new ol.format.GeoJSON().readFeatures( feicao , {
			//featureProjection: 'EPSG:3857'
		});
		
		me.deleteShips();
		
		for (var i = 0; i < features.length; i++) {
			me.vectorSource.addFeature( features[i] );
		}
		
    },
    
	getShips : function() {
		var me = this;
		
		Ext.Ajax.request({
            //url: 'aisGetShips',
            url: 'getVessel',
            failure: function (response, opts) {
            	//me.deleteShips();
            	
            },
            success: function (response, opts) {
            	me.updateLayer( response.responseText );
            }
        });
		
		
	} 


});
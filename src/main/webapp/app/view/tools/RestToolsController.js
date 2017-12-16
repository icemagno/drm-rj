Ext.define('MCLM.view.tools.RestToolsController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.restToolsController',
    
    theView : null,

    
	rioOnibus : function() {
		MCLM.Map.toggleOnibusTraffic();
	},
	
    
    
    show3dView : function() {
    	
    	if( MCLM.Globals.tdViewVisible ) {
        	$('#mainFlatMap').css('width','100%');
        	$('#tdMap').css('display','none');
        	MCLM.Globals.tdViewVisible = false;
        	MCLM.Map.map.updateSize();
        	return true;
    	}
    	
    	
    	MCLM.Globals.tdViewVisible = true;
    	
    	
    	$('#mainFlatMap').css('width','50%');
    	$('#tdMap').css('display','block');
    	MCLM.Map.map.updateSize();
    	
    	if ( MCLM.Globals.tdView == null ) {
    		
	    	MCLM.Globals.tdView = new ol.View({
	        	center: ol.proj.transform( MCLM.Map.arrayMapCenter , 'EPSG:4326', 'EPSG:3857'),
	            zoom: MCLM.Map.mapZoom
	        });
	    	
    	}
        
    	if ( MCLM.Map.tdMap === null ) {
    		
    		MCLM.Map.tdMap = new ol.Map({
				layers: [ MCLM.Map.imageryMap ],
				target: 'tdMap',
				view : MCLM.Globals.tdView,
				renderer: 'webgl',
				controls: [],			
			});
    	}
			
		
		MCLM.Globals.ol3d = new olcs.OLCesium({map: MCLM.Map.tdMap});
		var scene = MCLM.Globals.ol3d.getCesiumScene();
		
		scene.terrainProvider = new Cesium.CesiumTerrainProvider({
			url: 'https://assets.agi.com/stk-terrain/world',
			//url: 'http://192.168.25.55:8000/tilesets/srtm',
		    requestWaterMask : false, 
		    requestVertexNormals : false			
		});
		MCLM.Globals.ol3d.setEnabled(true);

		scene.globe.enableLighting = true;
		
		// Desabilita o mapa 3D. 
		scene.screenSpaceCameraController.enableZoom = false;
		scene.screenSpaceCameraController.enableRotate = false;
		
		var cam = MCLM.Globals.ol3d.getCamera();
		cam.setDistance(350000);
		cam.setHeading(6.289);
		cam.setTilt(1.2442318918054133);		
    	
		if ( MCLM.Globals.onChangeCenter == null ) {
			MCLM.Globals.onChangeCenter = MCLM.Map.theView.on('change:center', MCLM.Functions.syncMaps);
		}
		
		if ( MCLM.Globals.onChangeRotation == null ) {
			MCLM.Globals.onChangeRotation = MCLM.Map.theView.on('change:rotation', MCLM.Functions.syncMaps);
		}
		
		if ( MCLM.Globals.onChangeResolution == null ) {
			MCLM.Globals.onChangeResolution = MCLM.Map.theView.on('change:resolution', MCLM.Functions.syncMaps);
		}
		
		
		var handler = new Cesium.ScreenSpaceEventHandler( scene.canvas );
		handler.setInputAction( function(click) {
		    var pickedObject = scene.pick(click.position);
		    if ( Cesium.defined( pickedObject ) ) {
		    	var entity = pickedObject.id;
		    	//var carto = Cesium.Ellipsoid.WGS84.cartesianToCartographic( pickedObject.position );
		    	//MCLM.Globals.ol3d.trackedEntity = entity;
		    	//console.log( entity );
		    }
		    
		}, Cesium.ScreenSpaceEventType.LEFT_CLICK );		
		
		
		
		
		// --------------------------  EXPERIMENTAL --------------------------------------------------
		
		var image = new Cesium.ImageMaterialProperty({
			image : 'http://localhost:8080/mclm/img/apolo_logo_small.png',
			transparent : true,
		});

		
		var thePosition = Cesium.Cartesian3.fromDegrees(MCLM.Map.arrayMapCenter[0], MCLM.Map.arrayMapCenter[1], 100.0);
		
		var heading = Cesium.Math.toRadians(45.0);
		var pitch = Cesium.Math.toRadians(0.0);
		var roll = Cesium.Math.toRadians(0.0);
		var hpr = new Cesium.HeadingPitchRoll(heading, pitch, roll);
		var theOrientation = Cesium.Transforms.headingPitchRollQuaternion(thePosition, hpr);

		
		/*
		var aBox = new Cesium.Entity({
		    position : thePosition,
		    show : true,
		    model : {
		        uri : 'aeronaves/Cesium_Ground.gltf',
		        scale : 30000.0
		    }
		});
					
		
		var airPlane = new Cesium.Entity({
		    position : thePosition,
		    orientation : theOrientation,
		    show : true,
		    model : {
		        uri : 'aeronaves/a319.glb',
		        scale : 200.0
		    }
		});		
		
		
		var yellowBall = new Cesium.Entity({
		    name : 'Red sphere with black outline',
		    position: thePosition,
		    show : true,
		    ellipsoid : {
		        radii : new Cesium.Cartesian3(3000.0, 3000.0, 3000.0),
		        material : Cesium.Color.YELLOW.withAlpha(0.8),
		    }
		});
		
		
		//MCLM.Globals.ol3d.getDataSourceDisplay().defaultDataSource.entities.add( yellowBall );		
		MCLM.Globals.ol3d.getDataSourceDisplay().defaultDataSource.entities.add( airPlane );		
		*/
		
		// -------------------------------------------------------------------------------------------
    },
    
    
    toggleAeroTraffic : function() {
    	MCLM.Map.toggleAeroTraffic();
    },
    
    updateMaritmTraffic : function() {
    	MCLM.Map.toggleShipTraffic();
    },

    showStreetPhoto : function() {
    	MCLM.Map.toggleStreetPhoto();
    },
    
	toggleSeaMapLayer : function( button ) {
		MCLM.Map.toggleSeaMapLayer();
	},
	
	shoMarineTraffic : function( button ) {
		var center = MCLM.Map.map.getView().getCenter();
		var mapZoom = MCLM.Map.map.getView().getZoom();
		
		var center2 = center;
		//var center2 = ol.proj.transform([center[0], center[1]], 'EPSG:3857', 'EPSG:4326');
		
		var mapCenterLong = center2[0];
		var mapCenterLat = center2[1];
		var url = "https://www.marinetraffic.com/en/ais/embed/zoom:" + mapZoom + "/centery:"+mapCenterLat+"/centerx:"+mapCenterLong+"/maptype:4/shownames:true/mmsi:0/shipid:0/fleet:/fleet_id:/vtypes:/showmenu:false/remember:false";
		
		var frame = "<iframe scrolling='no' style='overflow:hidden;border:0px; width:100%;height:100%' src='"+url+"'></iframe>";
		
		var mTWindow = Ext.getCmp('mTWindow');
		if ( !mTWindow ) {
			mTWindow = Ext.create('MCLM.view.marinetraffic.MTWindow');
		}
		
		mTWindow.update( frame );
		mTWindow.show();
		
		
	}

    
});
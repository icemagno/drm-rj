Ext.define('MCLM.view.td.TDViewController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.tDViewController',


	init3dMap : function(){
		var ol3d = new olcs.OLCesium({map: window.map1, target: 'map2'});
		var scene = ol3d.getCesiumScene();
		var terrainProvider = new Cesium.CesiumTerrainProvider({
			//url : '//cesiumjs.org/stk-terrain/tilesets/world/tiles'
			url : '//assets.agi.com/stk-terrain/world'
		});
		scene.terrainProvider = terrainProvider;
		ol3d.setEnabled(true);  
		
		window.map2 = ol3d;
	}    
    

});
Ext.define('MCLM.view.rotas.CalcRotaController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.calcRota',
   
    init : function(app) {
        this.control({
        	
        	// Intercepta o evento 'click' do botao 'Enviar' do painel 'MCLM.view.addfolder.NewFolderForm' 
            '#calcRotaFormSubmit' : {
            	click: this.submitForm 
            },
        	// Intercepta o evento 'click' do botao 'Fechar' do painel 'MCLM.view.addfolder.NewFolderForm' 
            '#closeRotaWindow' : {
            	click: this.closeWindow 
            },
            
            '#clearRoutes' : {
            	click: this.clearRoutes 
            },
        })
    },
    
    clearRoutes : function() {
    	MCLM.RouteHelper.clear();
    	MCLM.RouteHelper.init();
    	MCLM.Globals.selectRouteActiveIcon = 'selectSourceIcon';
    	$("#selectTargetIcon").css("display","none");
    	$('#mainLoadingInfo').text("");
    	this.disableButtons();
    },
    
    closeWindow : function() {
    	var rotaWindow = Ext.getCmp('rotaWindow');
    	rotaWindow.close();
    },
    
    submitForm : function( ) {
    	var me = this;
    	var source = $("#sourceValue").val();
    	var target = $("#targetValue").val();
    	//var	bbox = MCLM.Map.getMapCurrentBbox();

    	if ( !source || !target ) {
    		Ext.Msg.alert('Erro','Selecione uma origem e um destino para a rota.' );
    		return true;
    	}
    	
    	Ext.Ajax.setTimeout(120000);
    	
		Ext.Ajax.request({
	       url: 'calcRoute',
	       params: {
	           'source': source,
	           'target' : target,
	           'kpaths' : 1,
	           'directed' : true
	       },       
	       success: function(response, opts) {
	    	   var respText = Ext.decode(response.responseText);
	    	   me.getFeaturesFromRouteData( respText );
	    	   me.enableButtons();
	       },
	       failure: function(response, opts) {
	    	   Ext.Msg.alert('Erro','Erro ao calcular a rota.' );
	       }
		});
    	return true;
    },
        
    
    addRouteToCurrentScenery : function() {
		var routeResultStore = Ext.data.StoreManager.lookup('store.RouteResult');
		var routeData = routeResultStore.getRange();
		var count = routeData.length;    	
		   
		if ( count == 0 ) {
			Ext.Msg.alert('Rota Inexistente','Calcule uma rota antes de executar esta operação.' );
			return true;
		}
		
		var geoJsonData = Ext.decode( MCLM.RouteHelper.getAsJson() );
		var parser = new jsts.io.OL3Parser();
		var union = null;
		var routeAsDirections = [];
		
		for ( x=0; x < geoJsonData.features.length; x++ ) {
			var feature = geoJsonData.features[x];
			routeAsDirections.push( feature.properties );
			
			var mls = new ol.geom.MultiLineString( feature.geometry.coordinates );
			var jstsGeom = parser.read( mls );
			
			if ( union == null ) {
				union = jstsGeom;
			} else {
				union = union.union( jstsGeom );
			}
			
		}
		
		var mergedGeom = parser.write(union);

		var feicao = this.createNewFeature( mergedGeom, routeAsDirections );
		
		var cloneToCenarioWindow = Ext.getCmp('cloneToCenarioWindow');
		if ( !cloneToCenarioWindow ) cloneToCenarioWindow = Ext.create('MCLM.view.datawindow.CloneToCenarioWindow');
		cloneToCenarioWindow.show();
		cloneToCenarioWindow.feicao = feicao;

    },
    
    
    createNewFeature : function( geometry, routeAsDirections ) {
    	
    	var compareFunction = function(a,b) {
    		return a.index - b.index;
    	}; 
    	
    	routeAsDirections.sort(compareFunction);
    	
    	var featureCollection = {};
    	var feature = {};
    	var properties = {};
    	var features = [];
    	
    	var desc = '';
    	var prefix = '';
    	for ( x=0; x < routeAsDirections.length; x++  ) {
    		var dir = routeAsDirections[x];
    		var desc = desc + prefix + dir.way_name + ' (' + dir.km + 'km)';
    		prefix = '; ';
    	}
    	
    	properties.directions = desc;
		properties.feicaoNome = 'Rota';
		properties.feicaoTipo = 'ROTA';
		properties.feicaoDescricao = 'Rota';
		
    	feature.type = 'Feature';
    	feature.geometry = {};
    	feature.geometry.type = 'MultiLineString';
    	feature.geometry.coordinates = geometry.getCoordinates();
    	feature.properties = properties;
    	
    	
    	features.push( feature );
    	featureCollection.type = 'FeatureCollection';
    	featureCollection.features = features;
    	
    	return featureCollection;
    	
    },
    
    
    disableButtons : function() {
    	var poiPanel = Ext.getCmp("routePoi");
		var buttons = poiPanel.query('button');
		Ext.Array.each(buttons, function(button) {
		    button.setDisabled(true);
		    button.toggle(false);
		});
    },
    
    
    enableButtons : function() {
    	var poiPanel = Ext.getCmp("routePoi");
		var buttons = poiPanel.query('button');
		Ext.Array.each(buttons, function(button) {
		    button.setDisabled(false);
		    button.toggle(false);
		});
	},    

    getFeaturesFromRouteData : function( routeData ) {
    	var geojsonObject = '{"type": "FeatureCollection","crs": {"type": "name","properties": {"name": "EPSG:4326"} },"features": ['; 
    	var prefix = "";
    	
		var newMultiline = {};
		newMultiline.type = 'MultiLineString';
		var newCoordinates = [];
    	
    	
    	for(x=0; x < routeData.length; x++ ) {
    		var routeSeq = routeData[x].seq;
    		var maxSeq = routeSeq + MCLM.RouteHelper.maxRouteSeq;
    		routeData[x].seq = maxSeq; 
    		
    		var featureProperties = '{"index":"'+ routeData[x].seq +'", "way_name":"'+ routeData[x].way_name +'", "km":"'+ routeData[x].km + '"}';
    		
    		geojsonObject = geojsonObject + prefix + '{"type": "Feature","properties": '+featureProperties+
    			',"geometry":' + JSON.stringify( routeData[x].geometry ) + '}';
    		prefix = ",";
    		
    		var geom = routeData[x].geometry;
    		if ( geom ) {
	    		for (z=0; z < geom.coordinates.length; z++   ) {
	    			newCoordinates.push( geom.coordinates[z] )
	    		}
    		} else {
    			//
    		}
 
    	}
    	
    	var routeResultStore = Ext.data.StoreManager.lookup('store.RouteResult');
    	routeResultStore.loadData( routeData, true );
    	
		newMultiline.coordinates = newCoordinates;
		
		MCLM.RouteHelper.maxRouteSeq = maxSeq + 1;

    	geojsonObject = geojsonObject + "]}";
    	MCLM.RouteHelper.loadRoute( geojsonObject, newMultiline );
    	
    	$("#selectTargetIcon").css("display","none");
    	MCLM.Globals.routeBlinkEnabled = false;
    	MCLM.Map.unbindMapClick();
    	
    }	

});
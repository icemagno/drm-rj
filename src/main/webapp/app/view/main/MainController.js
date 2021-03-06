
Ext.define('MCLM.view.main.MainController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.main',
	requires: [
	   'MCLM.Globals',        
	   'MCLM.view.config.ConfigWindow'
	],
	
	// --------------------------------------------------------------------------------------------
    // Methods / Events
	// --------------------------------------------------------------------------------------------
	
	
	// Teste para pegar uma camada como GEOJSON
	/*
	teste : function( button ) {
		var me = this;
		
		var vectorSource = new ol.source.Vector({	
			url: function(extent) {
				var sourceUrl = 'http://osm.casnav.mb/osmope/osm/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=osm:curvas_nivel&outputFormat=application/json&srsname=EPSG:4326&bbox=' + extent.join(',') + ',EPSG:4326';
				var encodedUrl = encodeURIComponent( sourceUrl );
				return 'getLayerAsFeatures?sourceUrl=' + encodedUrl;
			},
			strategy: ol.loadingstrategy.bbox,
			projection: 'EPSG:4326',
			format: new ol.format.GeoJSON(),
		});
		
		var vector = new ol.layer.Vector({	
			source: vectorSource,
		});

		MCLM.Map.map.addLayer(vector);
		
		var r3D = new ol.render3D({ height:500, maxResolution:10 });
		vector.setRender3D(r3D);		
	},
	*/
	// ----------------------------------------------------------------
	
	toggleMagnify : function( button ) {
		MCLM.Map.toggleMagnify();
	},	
	
	toggleMapGrid : function( button ) {
		MCLM.Map.toggleMapGrid();
	},
	
	ajuda : function() {
		window.open("help.jsp");
	},

	showRestTools : function( button ) {
    	var restToolsWindow = Ext.getCmp('restToolsWindow');
    	if ( restToolsWindow ) return;
    	
    	restToolsWindow = Ext.create('MCLM.view.tools.RestToolsWindow');
    	restToolsWindow.show();    	
    	restToolsWindow.alignTo(Ext.getBody(), "tr-tr", [-90, 70]);
    	
    	Ext.getCmp('tdviewID').toggle( MCLM.Globals.tdView );
    	Ext.getCmp('rioOnibusID').toggle( MCLM.Map.onibusTrafficEnabled );
    	
	},
	
	undoZoom : function() {
		MCLM.Map.undoZoom();
	},
	
    showForecastToolBar : function() {
    	
		var restWeatherWindow = Ext.getCmp('restWeatherWindow');
		if ( !restWeatherWindow ) {
			restWeatherWindow = Ext.create('MCLM.view.tools.RestWeatherWindow');
		}
		restWeatherWindow.show();
		restWeatherWindow.alignTo(Ext.getBody(), "tr-tr", [-90, 70]);
    	
    },
    	
	// --------------------------------------------------------------------------------------------
	manageServers : function( button ) {
    	var serversWindow = Ext.getCmp('serversWindow');
    	if ( serversWindow ) return;
    	
    	var serversStore = Ext.getStore('store.externalsource');
    	serversStore.load();
    	
    	var postgreStore = Ext.getStore('store.postgresource');
    	postgreStore.load();
    	
    	serversWindow = Ext.create('MCLM.view.servers.ServersWindow');
    	serversWindow.show();
	},
	// --------------------------------------------------------------------------------------------
	toggleBaseLayer : function( button ) {
		MCLM.Map.toggleBaseLayer();
	},
	// --------------------------------------------------------------------------------------------
    showConfig : function ( button ) {
    	var configWindow = Ext.getCmp('configWindow');
    	if ( configWindow ) return;
    	configWindow = Ext.create('MCLM.view.config.ConfigWindow');
    	configWindow.show();
    	var configForm = Ext.getCmp('configForm');
    	configForm.getForm().setValues( MCLM.Globals.config );    	
    },
	// --------------------------------------------------------------------------------------------
    calcRoute : function() {
    	var rotaWindow = Ext.getCmp('rotaWindow');
    	if ( rotaWindow ) return;
    	rotaWindow = Ext.create('MCLM.view.rotas.RotaWindow');
    	rotaWindow.alignTo(Ext.getBody(), "tl-tl", [0, 0]);    	
    	rotaWindow.show();
    	MCLM.Globals.routeBlinkEnabled = true;
    },
	// --------------------------------------------------------------------------------------------
    editStyles : function() {
    	var styleListWindow = Ext.getCmp('styleListWindow');
    	if ( styleListWindow ) return;
    	styleListWindow = Ext.create('MCLM.view.style.StyleListWindow');
    	styleListWindow.show();    	
    },
	// --------------------------------------------------------------------------------------------
    checkInternetConnection: function ( button ) {
    	var box = Ext.MessageBox.wait('Aguarde alguns instantes enquanto a conexão com a Internet é testada.', 'Verificando Conectividade');
    	
    	Ext.Ajax.request({
    		url: 'internetAccessTest',
    		success: function(response, opts) {
    			box.hide();
    			var result = Ext.decode( response.responseText );
    			if( result.conectado ) {
    				Ext.Msg.alert('Conectado', 'O Sistema consegue acessar a Internet sem problemas.');
    			} else {
    				Ext.Msg.alert('Não Conectado', 'O Sistema não é capaz de acessar a Internet. Verifique as configurações de Proxy.');
    			}
    		},
    		failure: function(response, opts) {
    			box.hide();
    			Ext.Msg.alert('Erro ao tentar verificar a conexão com a Internet.' );
    		}
    	});			
    },    
	// --------------------------------------------------------------------------------------------
    toggleQueryTool : function () {
    	MCLM.Map.toggleQueryTool();
	},
	// --------------------------------------------------------------------------------------------
	showLayerStack : function() {
    	var stackWindow = Ext.getCmp('layerStack');
    	if ( stackWindow ) return;
    	stackWindow = Ext.create('MCLM.view.stack.LayerStack');
    	stackWindow.show();	
    	// Dispara um evento de atualizacao das mini imagens
    	// quem vai interceptar eh o controller 'MCLM.view.stack.LayerStackController' 
    	this.fireEvent('mountImagePreview');
	},
	// --------------------------------------------------------------------------------------------
    // Exibe a barra de ferramentas de desenho
    showDrawToolBar : function() {

    	var stylesStore = Ext.getStore('store.styles');
    	stylesStore.load({
            callback : function(records, options, success) {
            	var drawToolBar = Ext.getCmp("drawToolBar");
            	if ( !drawToolBar ) { 
            		drawToolBar = Ext.create('MCLM.view.draw.DrawToolBarWindow');
            	}
            	drawToolBar.show();
            	var estiloCombo = Ext.getCmp("idFeicaoStyle");
            	estiloCombo.setValue( stylesStore.getAt(0) );
            }
        });     	
    	
    },
    
    
    showMeasureTool : function() {
    	var measureWindow = Ext.getCmp('measureWindow');
    	if( !measureWindow ) {
    		measureWindow = Ext.create('MCLM.view.tools.MeasureWindow');
    	}
    	measureWindow.show();
    },

    
});

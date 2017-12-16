Ext.define("MCLM.view.onibus.OnibusHelper", {
    xtype: 'onibusHelper',
    id: 'onibusHelper',
    
    vectorSource : null,
    activeOnibusLayer : null,
    redStyle : null,
    yellowStyle : null,

    init: function () {
    	
    	var customStyleFunction = function( feature, resolution ) {
    		var props = feature.getProperties();
    		var resultStyles = [];
    		
    		var bearing = props.direcao;
    		var velocidade = props.velocidade + "Km/H";
    		
			this.busStyle = new ol.style.Style({
				image: new ol.style.Icon({
					scale : 0.8,
					anchor: [0.5, 0.5],
					//rotation : bearing,
					anchorXUnits: 'fraction',
					anchorYUnits: 'fraction',
					opacity: 1.0,
					src: 'img/bus.png',
					rotateWithView: false
				}),
				
				text: new ol.style.Text({
				    font: '10px Consolas',
					textAlign: 'center',
					offsetX: 0,
					offsetY: 10,
					scale : 0.8,
					textBaseline: 'middle',
					fill: new ol.style.Fill({ color: '#000' }),
					stroke: new ol.style.Stroke({
						color: '#FFFFFF', width: 1
					}),
					text: velocidade,
				})
				  			
			});    	
			
        	resultStyles.push( busStyle );
        	return resultStyles;    	
			
    	};    	
    	
    	
    	this.vectorSource = new ol.source.Vector();
    	var me = this;
    	
    	this.activeOnibusLayer = new ol.layer.Vector({
			source: me.vectorSource,
			style: customStyleFunction
		});			
		
    	this.activeOnibusLayer.set('name', 'onibusLayer');
    	this.activeOnibusLayer.set('alias', 'onibusLayer');
    	this.activeOnibusLayer.set('serialId', 'onibusLayer');
    	this.activeOnibusLayer.set('layerType', 'FEI');
    	this.activeOnibusLayer.set('baseLayer', false);
    	this.activeOnibusLayer.set('ready', true);  

    },

    showOnibusDetails : function( onibus ) {
    	// Object { geometry: Object, datahora: "10-23-2017 11:08:34", linha: "B10052", ordem: 327, latitude: -22.825556, longitude: -43.169159, velocidade: 0.37 }
    	console.log( onibus );
    	
    	var html = "<div style='width: 100%;background-color:rgb(0, 146, 255)'><img src='img/dataRioLogo.png' style='width: 100%;'></div>" +
    			"<div style='padding : 5px;'>Linha: " + onibus.linha + "<br>Ordem: " + onibus.ordem + "<br>Velocidade: " + onibus.velocidade +
    	"<br>Direção: " + onibus.direcao + 
    	"<br>Últ. Atualização: " + onibus.datahora + "</div>";
    	
    	var onibusDataWindow = Ext.getCmp('onibusDataWindow');
    	if ( !onibusDataWindow ) {
    		onibusDataWindow = Ext.create('MCLM.view.onibus.OnibusDataWindow');
    	}
    	onibusDataWindow.show();
    	onibusDataWindow.setTitle("Dados do Onibus");
    	
    	onibusDataWindow.update( html );
    	
    },
    

    deleteOnibus : function( ) {
    	var features = this.vectorSource.getFeatures();
    	for ( x=0; x < features.length; x++ ) {
    		var feature = features[x];
   			this.vectorSource.removeFeature( feature );
    	}
    	
    	/*
    	var me = this;
    	var features = this.vectorSource.getFeatures();
    	
    	if( !newFeatures )  {
    		console.log('Nada a fazer. Saindo.');
    		return true;
    	}    	
    	
    	if ( features.length === 0 ) {
    		console.log('Adicionando todos os onibus');
			for (var i = 0; i < newFeatures.length; i++) {
				me.vectorSource.addFeature( newFeatures[i] );
			}    		
			return true;
    	}
    	
    	console.log('Adicionando somente o que chegou.');
    	for ( x=0; x < newFeatures.length; x++ ) {
    		var newFeature = newFeatures[x];
   			var newOrdem = newFeature.get("ordem");
    		var foundFeature = false;
    		
   	    	for ( y=0; y < features.length; y++ ) {
   	    		var feature = features[y];
   	    		var ordem = feature.get("ordem");
   	    		
   	    		feature.setStyle( me.yellowStyle );
   	    		
   	    		if ( ordem == newOrdem ) {
   	    			console.log('Adicionando onibus ' + ordem );
   	    			feature.setStyle( me.redStyle );	
   	    			foundFeature = true;
   	    		}
   	    		
   	    	}
   	    	
    		
    	}

    	if ( foundFeature ) {
    		activeOnibusLayer.redraw();
    	}
    	*/
    },	
	
	getOnibus : function() {
		var me = this;

		var linha = '422';
		
		
    	Ext.Ajax.request({
    		url: 'dataRioOnibus',
    		params: {
	           'linha': linha,
	        },       		
    		success: function(response, opts) {
    			// "DATAHORA","ORDEM","LINHA","LATITUDE","LONGITUDE","VELOCIDADE"
    			var result = Ext.decode( response.responseText );
    			
    			if( result.DATA ) {
    				var tracks = result.DATA;
    				
                	var feicao = {};
                	feicao["type"] = "FeatureCollection";
                	var features = [];
                	
                	for( x-0; x<tracks.length; x++ ) {
                		var bus = tracks[x];
                		
                		var properties = {};
                		var feature = {};
                		var coordinates = [];
                		
                		properties["datahora"] = bus[0];
               			properties["ordem"] = bus[1];
               			properties["linha"] = bus[2];
               			properties["latitude"] = bus[3];
               			properties["longitude"] = bus[4];
               			properties["velocidade"] = bus[5];
               			properties["direcao"] = bus[6];
               			
            			coordinates[1] = bus[3]; 
            			coordinates[0] = bus[4];
               			
                		var geometry = {};
                		geometry["type"] = "Point";
                		geometry["coordinates"] = coordinates;
                		
                		feature["geometry"] = geometry;
                		feature["type"] = "Feature";
                		feature["properties"] = properties;            			
            			
            			features.push( feature );

                	}
                	
                	feicao["features"] = features;

    				me.deleteOnibus( features );

    				var features = new ol.format.GeoJSON().readFeatures( feicao , {
    					//featureProjection: 'EPSG:3857'
    				});
    				
    				for (var i = 0; i < features.length; i++) {
    					me.vectorSource.addFeature( features[i] );
    				}       				
                	
    			} else {
    				//Ext.Msg.alert('Não Conectado', 'O Sistema não é capaz de acessar a Internet. Verifique as configurações de Proxy.');
    			}
    			
    			
    		},
    		failure: function(response, opts) {
    			//Ext.Msg.alert('Erro ao tentar verificar a conexão com a Internet.' );
    		}
    	});			
		
		
	} 


});
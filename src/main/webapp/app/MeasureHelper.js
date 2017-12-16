Ext.define('MCLM.MeasureHelper', {
	
	statics: {
		source : null,
		vector : null,
		sketch : null,
		helpTooltip : null,
		measureTooltipElement: null,
		helpTooltipElement : null,
		measureTooltip : null,
		continuePolygonMsg : 'Clique para continuar desenhando o polígono',
		continueCircleMsg : 'Mova para continuar desenhando o círculo',
		continueLineMsg : 'Clique para continuar desenhando a linha',
		draw : null,
		typeSelect : null,
		listener : null,
		mouseoutEvt : null,
		pointermoveEvt : null,
		
		// changeTo('LineString' ou 'Polygon')
		changeTo : function( geomType ) {
			MCLM.MeasureHelper.typeSelect = geomType;
	        MCLM.Map.map.removeInteraction( MCLM.MeasureHelper.draw);
	        MCLM.MeasureHelper.addInteraction();			
		},
		
		removeTool : function() {
			MCLM.Map.map.removeInteraction( MCLM.MeasureHelper.draw);	
			MCLM.Map.map.removeLayer( MCLM.MeasureHelper.vector );
			$( ".tooltip" ).remove();
			ol.Observable.unByKey( MCLM.MeasureHelper.listener );
			MCLM.Map.map.getViewport().removeEventListener( 'mouseout', MCLM.MeasureHelper.mouseOutHandler );
			
			MCLM.Map.map.un('pointermove', MCLM.MeasureHelper.pointerMoveHandler);
			
			MCLM.Map.map.removeOverlay( MCLM.MeasureHelper.measureTooltip );
			MCLM.Map.map.removeOverlay( MCLM.MeasureHelper.helpTooltip );
			MCLM.MeasureHelper.measureTooltipElement = null;
			MCLM.MeasureHelper.helpTooltipElement = null;
			MCLM.MeasureHelper.measureTooltip = null;
		}, 
		
		// init('LineString' ou 'Polygon') 
		init : function( geomType ) {
			
			MCLM.MeasureHelper.removeTool();
			
			MCLM.MeasureHelper.source = new ol.source.Vector({
				projection: 'EPSG:4326',
			});
			
			MCLM.MeasureHelper.vector = new ol.layer.Vector({
				source: MCLM.MeasureHelper.source,
				style:  MCLM.MeasureHelper.getStyle,
			});			

			
			MCLM.MeasureHelper.source.on('addfeature', function(evt){
				//
			});				
			
			
			MCLM.MeasureHelper.pointermoveEvt = MCLM.Map.map.on('pointermove', MCLM.MeasureHelper.pointerMoveHandler);			
			MCLM.MeasureHelper.mouseoutEvt = MCLM.Map.map.getViewport().addEventListener('mouseout', MCLM.MeasureHelper.mouseOutHandler);	

			
			MCLM.MeasureHelper.createMeasureTooltip();
			MCLM.MeasureHelper.createHelpTooltip();				
			
			MCLM.MeasureHelper.typeSelect = geomType;
			MCLM.MeasureHelper.addInteraction();
			
			MCLM.Map.map.addLayer( MCLM.MeasureHelper.vector );
		},
		
		mouseOutHandler : function() {
			MCLM.MeasureHelper.helpTooltipElement.classList.add('hidden');
		},
		

		getStyle : function( feature, resolution ) {
			var resultStyles = [];
			var style = new ol.style.Style({
				fill: new ol.style.Fill({
					color: 'rgba(247, 192, 29, 0.3)'
				}),
				stroke: new ol.style.Stroke({
					color: '#ffcc33',
					width: 2
				}),
				image: new ol.style.Circle({
					radius: 7,
					fill: new ol.style.Fill({
						color: '#ffcc33'
					})
				})
			});
			
			resultStyles.push( style );
			return resultStyles;
		},
		
		
		pointerMoveHandler : function(evt) {
	        if ( evt.dragging ) {
	            return;
	        }			
	        var helpMsg = 'Clique para começar...';
			
	        if ( MCLM.MeasureHelper.sketch ) {
	        	var geom = ( MCLM.MeasureHelper.sketch.getGeometry() );
	        	if (geom instanceof ol.geom.Polygon) {
	        		helpMsg = MCLM.MeasureHelper.continuePolygonMsg;
	        	} else if (geom instanceof ol.geom.LineString) {
	        		helpMsg = MCLM.MeasureHelper.continueLineMsg;
	            } else if (geom instanceof ol.geom.Circle) {
	            	helpMsg = MCLM.MeasureHelper.continueCircleMsg;
	            }
	        }
	        
	        MCLM.MeasureHelper.helpTooltipElement.innerHTML = helpMsg;
	        MCLM.MeasureHelper.helpTooltip.setPosition( evt.coordinate );
	        MCLM.MeasureHelper.helpTooltipElement.classList.remove('hidden');	        
		},


		
		formatLength : function(line) {
			var wgs84Sphere = new ol.Sphere(6378137);
			var length;
			var coordinates = line.getCoordinates();
			length = 0;
			var sourceProj = MCLM.Map.map.getView().getProjection();
			for (var i = 0, ii = coordinates.length - 1; i < ii; ++i) {
				var c1 = ol.proj.transform(coordinates[i], sourceProj, 'EPSG:4326');
				var c2 = ol.proj.transform(coordinates[i + 1], sourceProj, 'EPSG:4326');
				length += wgs84Sphere.haversineDistance(c1, c2);
			}
			var output;
			if (length > 100) {
				var inKm = (Math.round(length / 1000 * 100) / 100);
				var inNm = (inKm * 0.539957);
				inNm = Math.round(inNm * 100) / 100;
				output = inKm + ' km <br>' + inNm + ' mn';
			} else {
				var inMeters = (Math.round(length * 100) / 100);
				output = inMeters + ' m';
			}
			return output;
			
		},
		
		
		
		formatArea : function(polygon) {
			var wgs84Sphere = new ol.Sphere(6378137);
			
			if ( polygon instanceof ol.geom.Circle ) {
				  console.log( polygon.getCenter() + " " +  polygon.getRadius() );
				  var circPoly = ol.geom.Polygon.fromCircle(polygon, 64, 0);
				  polygon = circPoly;
			}
			
			var area;
			var sourceProj = MCLM.Map.map.getView().getProjection();
			var geom = (polygon.clone().transform( sourceProj, 'EPSG:4326') );
			var coordinates = geom.getLinearRing(0).getCoordinates();
			area = Math.abs(wgs84Sphere.geodesicArea(coordinates));
			var output;
			if (area > 10000) {
				output = (Math.round(area / 1000000 * 100) / 100) + ' ' + 'km<sup>2</sup>';
			} else {
				output = (Math.round(area * 100) / 100) + ' ' + 'm<sup>2</sup>';
			}
			return output;
		},
		
		
		createMeasureTooltip : function() {
			if ( MCLM.MeasureHelper.measureTooltipElement) {
				MCLM.MeasureHelper.measureTooltipElement.parentNode.removeChild( MCLM.MeasureHelper.measureTooltipElement );
			}
			MCLM.MeasureHelper.measureTooltipElement = document.createElement('div');
			MCLM.MeasureHelper.measureTooltipElement.className = 'tooltip tooltip-measure';
			
			MCLM.MeasureHelper.measureTooltip = new ol.Overlay({
				element: MCLM.MeasureHelper.measureTooltipElement,
				offset: [0, -15],
				positioning: 'bottom-center'
			});
			
			MCLM.Map.map.addOverlay( MCLM.MeasureHelper.measureTooltip );
		},
		
		
		createHelpTooltip : function() {
			if ( MCLM.MeasureHelper.helpTooltipElement ) {
				MCLM.MeasureHelper.helpTooltipElement.parentNode.removeChild( MCLM.MeasureHelper.helpTooltipElement );
			}
			MCLM.MeasureHelper.helpTooltipElement = document.createElement('div');
			MCLM.MeasureHelper.helpTooltipElement.className = 'tooltip hidden';
			
			MCLM.MeasureHelper.helpTooltip = new ol.Overlay({
				element: MCLM.MeasureHelper.helpTooltipElement,
				offset: [15, 0],
				positioning: 'center-left'
			});
			
			MCLM.Map.map.addOverlay( MCLM.MeasureHelper.helpTooltip );
		},
		
		
		addInteraction : function() {
			MCLM.MeasureHelper.draw = new ol.interaction.Draw({
				source: MCLM.MeasureHelper.source,
				type: MCLM.MeasureHelper.typeSelect,
				style: new ol.style.Style({
					fill: new ol.style.Fill({
						color: 'rgba(244, 47, 26, 0.2)'
					}),
					stroke: new ol.style.Stroke({
						color: 'rgba(244, 47, 26, 0.5)',
						lineDash: [10, 10],
						width: 2
					}),
					image: new ol.style.Circle({
						radius: 5,
						stroke: new ol.style.Stroke({
							color: 'rgba(244, 47, 26, 0.7)'
						}),
						fill: new ol.style.Fill({
							color: 'rgba(244, 47, 26, 0.2)'
						})						
					})
					
				})
			
			});
		
			MCLM.Map.map.addInteraction( MCLM.MeasureHelper.draw );
			
			MCLM.MeasureHelper.draw.on('drawstart', function(evt) {
				MCLM.MeasureHelper.sketch = evt.feature;
				var tooltipCoord = evt.coordinate;
				MCLM.MeasureHelper.listener = MCLM.MeasureHelper.sketch.getGeometry().on('change', function(evt) {
	                var geom = evt.target;
	                var output;
	                
	                if ( (geom instanceof ol.geom.Polygon) || (geom instanceof ol.geom.Circle) ) {
	                	output = MCLM.MeasureHelper.formatArea(geom);
	                    if ( geom instanceof ol.geom.Polygon) { 
	                    	tooltipCoord = geom.getInteriorPoint().getCoordinates();
	                    } 
	                    if ( geom instanceof ol.geom.Circle) {
	                    	tooltipCoord = geom.getCenter();
	                    }
	                    
	                } else if (geom instanceof ol.geom.LineString) {
	                	output = MCLM.MeasureHelper.formatLength(geom);
	                	tooltipCoord = geom.getLastCoordinate();
	                }	                
	                MCLM.MeasureHelper.measureTooltipElement.innerHTML = output;
	                MCLM.MeasureHelper.measureTooltip.setPosition(tooltipCoord);
	                
	                
				});
				
			}, this);
			
			MCLM.MeasureHelper.draw.on('drawend',   function() {
				MCLM.MeasureHelper.measureTooltipElement.className = 'tooltip tooltip-static';
				MCLM.MeasureHelper.measureTooltip.setOffset([0, -7]);
				MCLM.MeasureHelper.sketch = null;
				MCLM.MeasureHelper.measureTooltipElement = null;
				MCLM.MeasureHelper.createMeasureTooltip();
				ol.Observable.unByKey( MCLM.MeasureHelper.listener );
			}, this);
			
			
			
		},
		
		
		
		
		
		
		
	}

});


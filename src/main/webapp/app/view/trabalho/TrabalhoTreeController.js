Ext.define('MCLM.view.trabalho.TrabalhoTreeController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.trabalho',
    
    textBoxes : [],
    
    addingText : false,
    
    init : function(app) {
        this.control({
            '#trabalhoTreeView' : {
            	drop: this.afterDropNode 
            }
            
        });
    },     
    
    listen : {
        controller : {
            '*' : { 
            	// Disparado por MCLM.view.paineis.LayerTreeController ao mudar o estado de uma camada.
            	syncLayerNodeInTrabalhoTree : 'syncLayerNodeInTrabalhoTree',
            	afterDropNode : 'afterDropNode',
            	doClearWorkspace : 'doClearWorkspace'
            }
        }
    },  
    
    reloadWorkspace : function( button ) {
		var row = MCLM.Globals.currentSceneryData;
		var currentScenery = MCLM.Globals.currentScenery;
		
		var sceneryName = row.get('sceneryName');
		var zoomLevel = row.get('zoomLevel');
		var mapCenter = row.get('mapCenter');
		var graticule = row.get('graticule');

		this.doClearWorkspace();
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
    
    
    editFeicao : function( record ) {
    	
    	var layerName = record.get('layerName');
    	var feicao = record.get('feicao');
    	var styleName = feicao.style.featureStyleName;
    	var layer = MCLM.Map.findByName( layerName );
    	var source = layer.getSource();
    	var editFeicaoWindow = Ext.getCmp('editFeicaoWindow');
    	// --------------------------------------------------------------------
    	
    	var getStyle = function( feature, resolution ) {
    		var resultStyles = [];
    		var featureGeomType = feature.getGeometry().getType();
    		var props = feature.getProperties();
    						
    		// Circulo
    		var hexColor = MCLM.Map.editFeicaoStyle.iconColor;
    		var newColor = ol.color.asArray(hexColor);
    		newColor = newColor.slice();
    		newColor[3] = MCLM.Map.editFeicaoStyle.iconOpacity;	
    		
    		if ( featureGeomType == 'Circle' )  {
    			  var pointStyle = new ol.style.Style({
    					fill: new ol.style.Fill({
    						color: newColor
    					}),
    					stroke: new ol.style.Stroke({
    						color: MCLM.Map.editFeicaoStyle.iconColor,
    						width: 2
    					})
    			  });	
    			  resultStyles.push( pointStyle );					
    		}
    		
    		// Ponto
    		if ( featureGeomType == 'Point' ) {
    			
    			var hexColor = MCLM.Map.editFeicaoStyle.iconColor;
    			var newColor = ol.color.asArray(hexColor);
    			newColor = newColor.slice();
    			newColor[3] = MCLM.Map.editFeicaoStyle.iconOpacity;						
    			
    			if ( MCLM.Map.editFeicaoStyle.iconSrc ) {
    				// Se tiver icone (o caminho do icone) entao cria um estilo de icone
    				var pointStyle = new ol.style.Style({
    					  image: new ol.style.Icon(({
    							anchor: JSON.parse( MCLM.Map.editFeicaoStyle.iconAnchor ),
    							scale : MCLM.Map.editFeicaoStyle.iconScale,
    							anchorXUnits: MCLM.Map.editFeicaoStyle.iconAnchorXUnits,
    							anchorYUnits: MCLM.Map.editFeicaoStyle.iconAnchorYUnits,
    							opacity: MCLM.Map.editFeicaoStyle.iconOpacity,
    							color   : MCLM.Map.editFeicaoStyle.iconColor,
    							rotation: MCLM.Map.editFeicaoStyle.iconRotation,
    							src:  me.replacePattern(MCLM.Map.editFeicaoStyle.iconSrc, props)
    					  }))
    				});					
    			
    			} else {
    			
    				var pointStyle = new ol.style.Style({
    					image: new ol.style.Circle({
    						radius: MCLM.Map.editFeicaoStyle.iconScale,
    						fill: new ol.style.Fill({
    							color: newColor
    						}),
    						stroke: new ol.style.Stroke({
    							color: MCLM.Map.editFeicaoStyle.iconColor,
    							width: 2
    						})
    					})
    				});
    			}
    			
    			resultStyles.push( pointStyle );
    		}

    		// Linha
    		try {
    			if ( featureGeomType == 'LineString' || featureGeomType == 'Line' ) {
    				var lineStyle = new ol.style.Style({
    					  fill: new ol.style.Fill({
    						  color: MCLM.Map.editFeicaoStyle.lineFillColor 
    					  }),
    					  stroke: new ol.style.Stroke({
    						  color: MCLM.Map.editFeicaoStyle.lineStrokeColor,
    						  width:  MCLM.Map.editFeicaoStyle.lineStrokeWidth,
    						  lineDash: JSON.parse( MCLM.Map.editFeicaoStyle.lineLineDash ) 
    					  })
    						
    				});	
    				resultStyles.push( lineStyle );
    			}
    		} catch ( err ) {
    			  
    		}	 				
    		
    		// Poligono
    		try {
    			  if ( featureGeomType == 'MultiPolygon' || featureGeomType == 'Polygon' ) {
    					var hexColor =  MCLM.Map.editFeicaoStyle.polygonFillColor;
    					var newColor = ol.color.asArray(hexColor);
    					newColor = newColor.slice();
    					newColor[3] =  MCLM.Map.editFeicaoStyle.polygonFillOpacity;
    					
    					var polFill = newColor;
    					
    					var ptrHDist = MCLM.Map.editFeicaoStyle.ptrHDist;
    					var ptrVDist = MCLM.Map.editFeicaoStyle.ptrVDist;
    					var ptrLength = MCLM.Map.editFeicaoStyle.ptrLength;
    					var ptrHeight = MCLM.Map.editFeicaoStyle.ptrHeight;
    					var ptrWidth = MCLM.Map.editFeicaoStyle.ptrWidth;
    					
    					if ( ptrHDist && ptrVDist )
    						polFill = MCLM.Functions.makePattern( newColor, ptrHDist, ptrVDist, ptrLength, ptrHeight, ptrWidth );
    												
    					
    					
    					
    					var polygonStyle = new ol.style.Style({
    						fill: new ol.style.Fill({
    							color: polFill,
    						}),
    						stroke: new ol.style.Stroke({
    							color:  MCLM.Map.editFeicaoStyle.polygonStrokeColor,
    							width:  MCLM.Map.editFeicaoStyle.polygonStrokeWidth, 
    							lineDash: JSON.parse(  MCLM.Map.editFeicaoStyle.polygonLineDash ), 
    							strokeLinecap :  MCLM.Map.editFeicaoStyle.polygonStrokeLinecap,
    						})
    					});
    					resultStyles.push( polygonStyle );
    			  }
    		} catch ( err ) {
    			  
    		}		
    		
    		
    		// Texto
    		var label = feature.getProperties().label;
    		var font = MCLM.Map.editFeicaoStyle.textFont;
    		
    		if( label && font ) {
    			
    			var featureText = new ol.style.Style({
    				text: new ol.style.Text({
    					text: label,
    					offsetY: MCLM.Map.editFeicaoStyle.textOffsetY,
    					offsetX: MCLM.Map.editFeicaoStyle.textOffsetX,
    					font: MCLM.Map.editFeicaoStyle.textFont,
    					scale : 1,
    					stroke: new ol.style.Stroke({
    						color: MCLM.Map.editFeicaoStyle.textStrokeColor,
    						width: MCLM.Map.editFeicaoStyle.textStrokeWidth
    					}),				                
    					fill: new ol.style.Fill({
    						color: MCLM.Map.editFeicaoStyle.textFillColor
    					}),
    				})
    			});		        	
    			resultStyles.push( featureText );
    		}				
    		
    		
    		
    		return resultStyles;
    	}
    	
    	
    	// --------------------------------------------------------------------
    	
    	layer.setStyle( getStyle );
    	
    	if ( !editFeicaoWindow ) {
    		editFeicaoWindow = Ext.create('MCLM.view.tools.EditFeicaoWindow');
    	}
    	editFeicaoWindow.show();
    	
    	var stylesStore = Ext.getStore('store.styles');
    	stylesStore.load({
            callback : function(records, options, success) {
            	var estiloCombo = Ext.getCmp("idFeicaoStyle");
            	for ( x=0; x< records.length; x++ ) {
            		if ( stylesStore.getAt(x).get('featureStyleName') === styleName ) {
            			estiloCombo.setValue( stylesStore.getAt(x) );
            			break;
            		}
            	}
            }
        });      	
    	
    	
    	MCLM.Map.addInteractions( feicao, source, record );
    	
    },

    
    // Disparado apos um no ser movido para outra pasta
    afterDropNode : function  (node, data, overModel, dropPosition) {
		var theNode = data.records[0];
		theNode.data.idNodeParent = overModel.data.id;
    },
    
    // Marca/desmarca camadas de acordo com a arvore principal.
    // Disparado por MCLM.view.paineis.LayerTreeController ao mudar o estado de uma camada.
    syncLayerNodeInTrabalhoTree : function( serialId, status ) {
    	var trabalhoTree = Ext.getCmp("trabalhoTree");
    	var node = trabalhoTree.getRootNode().findChild('serialId',serialId,true);
    	if ( node ) {
	    	node.set('checked', status );
	    	node.dirty = true;
	    	this.clearCheckToTheRoot ( node.parentNode );
    	}
    	return true;
    },
        
    
    // Expande toda a arvore
    onTreeExpandAll : function( button ) {
    	var tree = Ext.getCmp('trabalhoTree');
    	tree.expandAll();
    },
    
    // Recolhe toda a arvore
    onTreeCollapseAll : function( button ) {
    	var tree = Ext.getCmp('trabalhoTree');
    	tree.collapseAll();
    },
    
    // Responde ao clique em um no. Mostra os detalhes do no painel abaixo da arvore
    onLayerTreeItemClick : function( view, record, item, index, e ) {
    	//
    },
    // Limpa  Cenário
    doClearWorkspace : function() {
    	var me = this;
		var tree = Ext.getCmp('trabalhoTree');
		var root = tree.getRootNode();
		root.set("text","Cenário");
		//root.set("checked",false);
		
    	var painelEsquerdo = Ext.getCmp('painelesquerdo');
    	painelEsquerdo.setTitle("");		    		
		
    	// Limpa a arvore principal
    	var layerTree = Ext.getCmp("layerTree");
    	
    	layerTree.getRootNode().cascade( function(node) { 
    		if (  (node.get('layerType') != '') && (node.get('layerType') != 'CRN') && (node.get('layerType') != 'FDR') ) node.set('checked', false );
		});   
    	
    	
    	// Apaga do layer stack
    	var trabalhoTree = Ext.getCmp("trabalhoTree");
    	trabalhoTree.getRootNode().cascade( function(node) { 
    		if (  (node.get('layerType') != '') && (node.get('layerType') != 'CRN') && (node.get('layerType') != 'FDR') ) node.set('checked', false );
    		me.toggleNode( node );
		});			    	
    	
    	// Limpa a arvore do cenario (trabalho)
		root.removeAll();
		MCLM.Globals.currentScenery = -1;
		MCLM.Globals.currentSceneryData = null;
		
		var cloneSceneryButton = Ext.getCmp('svCenaryAsBtn'); 
		cloneSceneryButton.disable();
		
		
		var mapZoom = MCLM.Globals.config.mapZoom; 
		var mapCenter = MCLM.Globals.config.mapCenter;		
		MCLM.Map.panTo( mapCenter, mapZoom );
		
		
    },
    // Pergunta se deseja limpar o Cenário
    clearWorkspace : function() {
    	var me = this;
		Ext.Msg.confirm('Limpar Cenário', 'Deseja realmente limpar o Cenário? As alterações não gravadas serão perdidas.', function( btn ){
			   if( btn === 'yes' ){
				   me.doClearWorkspace();
			   } else {
			       return;
			   }
		 });
		
    },
    // Processa cada nó da árvore de cenário após o cenário ser carregado.
    // Interceptado de 'MCLM.view.trabalho.TrabalhoTree' evento 'load'.
    onLoadNode : function(loader, nodes, response) {
    	var me = this;
    	for (x=0; x< nodes.length; x++  ) {
    		var node = nodes[x];
            var chk = node.get('checked');
            var layerName = node.get('layerName');
            var serialId = node.get('serialId');
            
            if ( layerName ) {
            	// Evento interceptado pelo controller da árvore principal. 
            	// 'MCLM.view.main.MainController'. Marca/desmarca camada de acordo o status da mesma camada do cenário.
    			this.fireEvent( "syncLayerNodeInMainTree", serialId, chk );
            	if ( chk ) {
					var layer = MCLM.Map.addLayer( node );
					me.clearCheckToTheRoot( node.parentNode );
            	}
            }
            
    	}
		this.fireEvent('mountImagePreview');		                    	
	},
    
    // Recursivamente marca/desmarca pais dos nos até o root
    recursiveCheckParent : function( node, pChildCheckedCount ) {
    	/*
	    if( node ) {
	    	node.set('checked', !!pChildCheckedCount);
	    	var parent = node.parentNode;
	    	this.recursiveCheckParent( parent, pChildCheckedCount );
	    }
	    */
    },
    
    clearCheckToTheRoot : function ( parentNode ) {
    	/*
    	var me = this;
	    
	    var pChildCheckedCount = 0;
	    parentNode.suspendEvents();
	    parentNode.eachChild(function(c) { 
	        if ( c.get('checked') ) pChildCheckedCount++; 
	    });
	    
	    parentNode.set('checked', !!pChildCheckedCount);
	    me.recursiveCheckParent( parentNode, pChildCheckedCount );
	    */	    	
    },
    
    // Quando o estado do no muda (selecionado/nao selecionado)
    // Adiciona ou remove uma camada na lista de camadas e no mapa
    onLayerTreeCheckChange : function( node, checked, eOpts ) {
    	if ( !node.isLeaf() ) {
			Ext.Msg.alert('Operação Inválida', 'Não é permitido marcar um grupo de camadas. Você deve marcar as camadas individualmente.' );
			node.set('checked',false);
			return;
    	}
    	var me = this;
	    var serialId = node.get('serialId');
	    // Interceptado por 'MCLM.view.paineis.LayerTreeController'
	    this.fireEvent( "syncLayerNodeInMainTree", serialId, checked );
	    
	    this.toggleNode( node );
	    node.dirty = true;
	    node.set("selected", node.get("checked") );
	    
	    var p = node.parentNode;
	    if ( !p ) return true;
	    me.clearCheckToTheRoot( p );
	    
    },

    // Mosta o menu de contexto quando clica com botao direito do mouse em um no da arvore
    onContextMenu : function( tree, record, item, index, e, eOpts ) {
    	var me = this;
    	var data = record.data;
    	
		if ( data.layerType == 'FEI' ) {

		    var menu_grid = new Ext.menu.Menu({ 
		    	items: [
		    	  { iconCls: 'goto-icon', text: 'Zoom Para Feição', handler: function() { me.goToFeicao( record ); } },
		    	  { iconCls: 'draw-icon', text: 'Editar Feição', handler: function() { me.editFeicao( record ); } },
	  	          { iconCls: 'add-folder-icon', text: 'Criar Nova Pasta', handler: function() { me.addNewFolder(record); } },
				  { xtype: 'menuseparator' },
		          { iconCls: 'delete-icon', text: 'Apagar', handler: function() { me.askDeleteLayer( record ); } }
		        ]
		    });
			
			
		} else {    	
    	
		    var menu_grid = new Ext.menu.Menu({ 
		    	items: [
	  	          { iconCls: 'add-folder-icon', text: 'Criar Nova Pasta', handler: function() { me.addNewFolder(record); } },
		          { xtype: 'menuseparator' },
		          { iconCls: 'delete-icon', text: 'Remover', handler: function() { me.askDeleteLayer( record ); } },
		        ]
		    });
		}
		
	    var position = [e.getX()-10, e.getY()-10];
	    menu_grid.showAt( position );
		e.stopEvent();    	
    },
    
    // Adiciona uma nova pasta na arvore 
    addNewFolder : function( record ) {
		var data = record.data;
		record.expand();
		
    	var newFolderWindow = Ext.getCmp('newFolderWindow');
    	if ( newFolderWindow ) return;
    	
    	var path = record.getPath("text");
    	var title = "Nova pasta em " + path,
    	
    	newFolderWindow = Ext.create('MCLM.view.addfolder.NewFolderWindow');
    	newFolderWindow.setTitle( title );

    	newFolderWindow.show();	

		var layerFolderID = Ext.getCmp('layerFolderID');
		layerFolderID.setValue( data.id );   
		
		var trabalhoAddFolder = Ext.getCmp('trabalhoAddFolder');
		trabalhoAddFolder.setValue( 'true' );  		
    	
    	Ext.getCmp('newFolderName').focus(true, 100);    	
    },
    reloadScenery : function() {
    	var me = this;
    	
    	// Apaga do layer stack
    	var trabalhoTree = Ext.getCmp("trabalhoTree");
    	trabalhoTree.getRootNode().cascade( function(node) { 
    		
    		if( (node.get('layerType') != '') && (node.get('layerType') != 'CRN') && (node.get('layerType') != 'FDR') ) {
    			node.set('checked', false );
    			me.toggleNode( node );
    		}
    		
		});			    	
			
		
    	var trabalhoTreeStore = Ext.getStore('store.trabalhoTree');
		trabalhoTreeStore.load({
			params:{cenario: MCLM.Globals.currentScenery},
		    callback: function(records, operation, success) {
		    	if ( success ) {
		    		var tree = Ext.getCmp('trabalhoTree');
		    		var root = tree.getRootNode();
		    		if( root ) {
		    			root.collapse();
		    			tree.expandAll();
		    		}	
		    	}
		    }
		});      	
    },  

    
    
    
    // Abre a janela de seleção de cenários para carregar um cenario para a area de trabalho.
    loadScenery : function() {
    	var sceneryStore = Ext.getStore('store.Scenery');
    	sceneryStore.load();
    	sceneryStore.sort('sceneryName','ASC');
    	
    	var cenarioWindow = Ext.getCmp('cenarioWindow');
    	if ( cenarioWindow ) return;
    	cenarioWindow = Ext.create('MCLM.view.cenarios.CenarioWindow');
    	cenarioWindow.show();
    },
    
    
    // Salva a arvore do cenario
    updateSceneryTree : function() {
    	var me = this;
		// Salva a arvore de camadas
    	var trabalhoTreeStore = Ext.getStore('store.trabalhoTree');
    	
		trabalhoTreeStore.data.each( function( item, index, totalItems ) {
	        var layerName = item.get('layerName');
	        var serialId = item.get('serialId');
	        var layerType = item.get('layerType');
	        var layers = MCLM.Map.getLayers();
	        var length = layers.getLength(); 
	        	
	        if ( (layerType != 'FDR') && serialId) {

				for (var i = 0; i < length; i++) {
					var serial = layers.item(i).get('serialId');
					var opacity = layers.item(i).getOpacity() * 10;
					
					if (serial === serialId) {
			        	item.set("transparency", opacity );
			        	item.set("layerStackIndex", i );
			        	
					}
				}		        
				
	        }
	        
	    });	    	
    	
    	trabalhoTreeStore.sync({
			 params: {
			 	cenario: MCLM.Globals.currentScenery
			 },
		     success: function (action, options) {
		    	me.reloadScenery(); 
			 },
			 failure: function (action, options){
			    Ext.Msg.alert('Falha', 'Falha ao gravar Árvore de Camadas do Cenário.');
			 }	
    	});
    	
    },
    
    
    saveFeatureEditing : function () {
		var currentEditinFeature = MCLM.Map.editingFeature;

		MCLM.Map.map.removeInteraction( MCLM.Map.modify );
		MCLM.Map.map.removeInteraction( MCLM.Map.snap );
		MCLM.Map.map.removeInteraction( MCLM.Map.boxing );

		if ( currentEditinFeature ) {
			
			
			Ext.Msg.confirm('Feição Modificada', 'Uma Feição foi editada. Deseja gravar suas alterações?', function( btn ){
				   if( btn === 'yes' ){
					   //
				   } else {
				       return;
				   }
			 });
			
		}
		
    },
    
    
    // Salva os dados do cenario (zoom, center, etc)
    updateSceneryData : function() {
    	var me = this;
		var mapCenter = MCLM.Map.getMapCenter();
		var mapZoom = parseInt( MCLM.Map.getMapZoom() );	    	
		var mapaBase = MCLM.Map.getBaseMapName();
		var servidorBase = MCLM.Map.getBaseServerURL();
		var mapaBaseAtivo = MCLM.Map.isBaseMapActive();
		var gradeAtiva = MCLM.Map.isGraticuleActive();
		var mapBbox = MCLM.Map.getMapCurrentBbox();	
		
		me.saveFeatureEditing();
		
		Ext.Ajax.request({
			url: 'updateSceneryData',
		    params: {
		        'idScenery' 	: MCLM.Globals.currentScenery,
		        'mapCenter' 	: mapCenter,
		        'mapZoom' 		: mapZoom,
		        'mapaBase' 		: mapaBase,
		        'servidorBase' 	: servidorBase,
		        'mapaBaseAtivo' : mapaBaseAtivo,
		        'gradeAtiva' 	: gradeAtiva,
		        'mapBbox' 		: mapBbox,
		    },						
			success: function(response, opts) {
				me.updateSceneryTree();
		    	Ext.Msg.alert('Sucesso', 'Cenário gravado.');
			},
			failure: function(response, opts) {
				Ext.Msg.alert('Erro','Não foi possível atualizar os dados do cenário.' );
			}
		});
		
    },
    
    
    showPresentationBar : function() {
    	
    	var fcw = Ext.getCmp('presentationWindow');
    	if ( !fcw ) {
    		fcw = Ext.create('MCLM.view.tools.PresentationWindow');
    	}
    	fcw.show();
    	fcw.alignTo(Ext.getBody(), "bl-bl", [7, -70]);
    	
    },
    
    showFastChangeBar : function() {
    	
    	var fcw = Ext.getCmp('fastChangeWindow');
    	if ( !fcw ) {
    		fcw = Ext.create('MCLM.view.tools.FastChangeWindow');
    	}
    	fcw.show();
    	fcw.alignTo(Ext.getBody(), "bl-bl", [7, -40]);
    	
    },
    
    
    
    // Salva a area de trabalho atual como um cenario
    saveScenery : function() {
    	var me = this;
    	if ( MCLM.Globals.currentScenery == -1 ) {
    		// Nao temos cenario. Abre a janela para o usuario criar um.
    		// Apos o submit do form do cenario novo eh necessario enviar os dados
    		// da arvore. Isso esta sendo feito pelo evento do submit do form em
    		// MCLM.view.cenarios.SaveCenarioController
	    	var saveCenarioWindow = Ext.getCmp('saveCenarioWindow');
	    	if ( saveCenarioWindow ) return;
	    	saveCenarioWindow = Ext.create('MCLM.view.cenarios.SaveCenarioWindow');
	    	saveCenarioWindow.show();
	    	
			Ext.getCmp('mapCenterConfigField').setValue( MCLM.Map.getMapCenter() );
			Ext.getCmp('mapZoomConfigField').setValue( MCLM.Map.getMapZoom() );	    	
			Ext.getCmp('mapaBaseID').setValue( MCLM.Map.getBaseMapName() );
			Ext.getCmp('servidorBaseID').setValue( MCLM.Map.getBaseServerURL() );
			Ext.getCmp('mapaBaseAtivoID').setValue( MCLM.Map.isBaseMapActive() );
			Ext.getCmp('gradeAtivaID').setValue( MCLM.Map.isGraticuleActive() );
			Ext.getCmp('mapBbox').setValue( MCLM.Map.getMapCurrentBbox() );		
			Ext.getCmp('mapCenterHDMSId').setValue( MCLM.Map.getCenterHDMS() );
			
			Ext.getCmp('nomeCenarioID').focus(true, 100);
	    	
    	} else {
    		// Salva o cenario atual.
    		me.updateSceneryData();
    	}

   	
    },    
    
	askDeleteLayer: function( record ) {
		
		var name = record.data.layerAlias;
		var me = this;

		// nao pode apagar o root
		var id = record.get('id');
		if ( id == 0 ) {
			return true;
		}
		
		Ext.Msg.confirm('Apagar Camada', 'Deseja realmente remover a Camada/Pasta "' + name + '"  do cenário atual?', function( btn ){
			   if( btn === 'yes' ){
				   record.set("checked",false);
				   me.clearCheckToTheRoot( record );
				   me.deleteLayer( record );
			   } else {
			       return;
			   }
		 });	
		
	},
	
	// Efetivamente apaga um no da arvore
	deleteLayer : function ( record ) {
		var layerName = record.data.layerName;
		var serialId = record.data.serialId;
 	   	MCLM.Map.removeLayer( serialId );	
		record.parentNode.removeChild(record);
	},

    goToFeicao : function ( record ) {
		var parentNode = record.parentNode;
		var data = record.data;
		var layerName = data.layerName;
		var checked = record.get('checked');
		
		if ( !checked ) {
			Ext.Msg.alert('Zoom em Feição', 'Marque a Feição para que ela apareça no mapa antes.');
			return true;
			
		} 
		
		var layer = MCLM.Map.getLayerByName( layerName );
		var source = layer.getSource();
		MCLM.Map.theView.fit( source.getExtent(), {duration: 2000, maxZoom: 14});
		
    },
	
    
    createText : function( center, titulo, texto ) {
    	
    	MCLM.Globals.totalTextBoxes++;
    	var qtd = MCLM.Globals.totalTextBoxes;
    	var me = this;
    	var divId = 'popup'+qtd;
    	
    	var div = $('<div id="'+divId+'"></div>').addClass("popupArea");
    	$(document.body).append( div );
    	var domDiv = document.getElementById(divId);
    	
		var popup = new ol.Overlay({
			  element: domDiv,
			  stopEvent: false,
			  dragging: false,
			  positioning: 'left-top',

			  autoPan: true,
			  autoPanAnimation: { duration: 250 },
			  titulo : '',
			  texto : '',
				  			  
			  
		});
		
		this.textBoxes[titulo] = popup;
		
		MCLM.Map.map.addOverlay(popup);    	
		popup.setPosition( center );
		
		popup.set('titulo', titulo);
		popup.set('texto', texto)
		
		var boxDiv = '<div class="popupText"><div class="popupTitle">'+titulo+'</div>' + 
		'<div class="popupContent">'+texto+'</div></div>';
		
		domDiv.innerHTML = boxDiv;   	
 	
		
    },
    
    
	// Responde a mudanca de estado de um no ( selecionado/nao selecionado )
	toggleNode: function( node ) {
		var checked = node.get('checked');
		var layerName = node.get('layerName');
		var serialId = node.get('serialId' );
		var layerType = node.get('layerType' );
		
		if( checked == true ) {
			if( layerType == "FEI") {
				MCLM.Map.addFeicao( node );

				var metadados = Ext.decode( node.data.feicao.metadados );
				var feicaoTipo = metadados.features[0].properties.feicaoTipo;
				
				if ( feicaoTipo == 'TXT ') {
					var feicaoNome = metadados.features[0].properties.feicaoNome;
					var feicaoDescricao = metadados.features[0].properties.feicaoDescricao;
					var coordinates = metadados.features[0].geometry.coordinates;
					this.createText( coordinates, feicaoNome, feicaoDescricao );
				}
				
			} else {
				// adiciona a camada no mapa
				var layer = MCLM.Map.addLayer( node );
				this.fireEvent('mountImagePreview');
			}
		} else {
			if( layerType == "FEI") {
				MCLM.Map.removeFeicao( node );
				
				var metadados = Ext.decode( node.data.feicao.metadados );
				var feicaoNome = metadados.features[0].properties.feicaoNome;
				var ovl = this.textBoxes[feicaoNome];
				MCLM.Map.map.removeOverlay(ovl);
				this.textBoxes[feicaoNome] = null;
				
			} else {
				// Remove a camada do mapa
				MCLM.Map.removeLayer( serialId );
				// Interceptado por MCLM.view.stack.LayerStackController
				this.fireEvent('mountImagePreview');
			}
		}	
		
		
	},
	
    viewready: function (tree) {
    	// nao limita o drag nesta arvore
    }	
	
});
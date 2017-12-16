Ext.define('MCLM.view.paineis.PainelCentral', {
	extend: 'Ext.Panel',
	xtype: 'painelCentral',
	collapsible: false,
	region: 'center',
	margin: '0 0 0 0',
	layout:'fit',
	id: 'painelCentral',
	
	requires: [
	  'MCLM.Map'
	],
	
	
	html : '<div id="mainLoadingIcon" style="z-index:99;position:absolute;top:10px;left:30px;"><img style="width:30px;height:30px;" src="img/hourglass.svg"></div>' +
		'<div id="mainLoadingInfo" style="z-index:99;font-size:9px;position:absolute;top:2px;left:35px;"></div>' +
		'<div style="z-index:99;" onClick="MCLM.Functions.hideMainLog();" id="mainLogDisplayContainer"><table style="width:100%;" id="mainLogDisplayTable"><tbody></tbody></table></div>' +
	'<div style="width:100%;height:100%;float:left" id="mainFlatMap"></div><div style="display:none;border-left:2px solid #cacaca;width:50%;height:100%;float:left" id="tdMap"></div>',
	
	
	
	listeners:{
    	resize: function () {
    		MCLM.Map.map.updateSize();
        },
        
        afterrender:function(){
        	/*
			var container = this.body.dom.id;
			
			$("#" + container).append('<div id="mainLoadingIcon" style="position:absolute;top:10px;left:30px;">'+
			    	'<img style="width:30px;height:30px;" src="img/hourglass.svg"></div><div id="mainLoadingInfo" style="font-size:9px;position:absolute;top:2px;left:35px;"></div>'+
			    	'<div onClick="MCLM.Functions.hideMainLog();" id="mainLogDisplayContainer"><table style="width:100%;" id="mainLogDisplayTable"><tbody></tbody></table></div>');
			
			
			$("#" + container).append('<div style="width:100%;height:100%;float:left" id="mainFlatMap"></div>');
			$("#" + container).append('<div style="display:none;border-left:2px solid #cacaca;width:50%;height:100%;float:left" id="tdMap"></div>');
        	*/
        	
			$("#mainFlatMap").css('background-color', MCLM.Globals.config.mapBackgroudColor );
			MCLM.Map.loadMap( 'mainFlatMap' );
			
		}
	} 
   
	
});


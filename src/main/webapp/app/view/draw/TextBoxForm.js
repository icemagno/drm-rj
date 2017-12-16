Ext.define('MCLM.view.draw.TextBoxForm', {
	extend: 'Ext.form.Panel',
	
	xtype : 'textBoxForm',
	id : 'textBoxForm',

    frame: false,
    margin: "0 0 0 0",		
	
    bodyPadding: 5,
    
    defaultType: 'textfield',
    
    defaults: {
        anchor: '100%',
        msgTarget: 'under',
        labelWidth: 90
    },	    
    
    items: [{
        fieldLabel: 'Titulo',
        width: 330,
        id:'boxTitleId',
        name: 'boxTitle',
    },{
        fieldLabel: 'Coordenadas',
        width: 330,
        id:'coordinateId',
        name: 'coordinate',
    }, {
        fieldLabel: 'Descrição',
        width: 330,
        id:'boxDescriptionId',
        name: 'boxDescription',
        grow : false,
        xtype : 'textareafield'
    }],
    
    buttons: [{
	          text: 'Cancelar',
	          handler : 'onTextFormClose'
	      },{
	          text: 'Gravar',
	          handler : 'onTextFormSubmit'
          }
	]

});

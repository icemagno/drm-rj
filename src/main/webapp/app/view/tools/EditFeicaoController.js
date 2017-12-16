Ext.define('MCLM.view.tools.EditFeicaoController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.editFeicaoController',

    
    saveFeicao : function() {
		MCLM.Map.saveEditFeicao();
		var editFeicaoWindow = Ext.getCmp('editFeicaoWindow');
		editFeicaoWindow.close();
	},

	cancelEditFeicao : function() {
		//MCLM.Map.cancelEditFeicao();
		var editFeicaoWindow = Ext.getCmp('editFeicaoWindow');
		editFeicaoWindow.close();
	},
    

});
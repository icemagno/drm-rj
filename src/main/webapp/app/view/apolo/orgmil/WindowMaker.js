Ext.define('MCLM.view.apolo.orgmil.WindowMaker', {

	// http://apolo.defesa.mil.br//SIGLMD-web/api/v1/organizacoes/militares/58040160808180912245?user-hash=34CE32F4CACDD770D6BB0977E066F74724B170F3CCF7002BAA802170711F99DF&token=1fa2c309-ef6b-4155-a672-ebde4905364b

	// -----------------------------------------------------------------------------------------
	createTab : function( theTitle, theContent ) {
		
		var theTab = {
				title: theTitle,
			    bodyPadding: 0,
			    
				items:[{
			        xtype: 'panel',
			        padding: 3,
			        border: 0,
			        layout:'fit',
			        html : theContent	
				}]
		};  		
		
		return theTab;
	},

	noData : function() {
		var table = "<table style='width:100%;' class='dataWindow'>";
		table = table + "<tr class='dataWindowLine'><td class='lineSeparator' colspan='6'>Sem Informações</td></tr>";
		table = table + "</table>";
		return table;
	},
	
	
	getFunLogTab : function( data ) {
		var funLogs = data.funcoesLogisticasPanel;
		if( funLogs.length == 0 ) {
			return this.noData();
		}
		
		var table = "<table style='width:100%;' class='dataWindow'>";
		for (x=0; x< funLogs.length; x++ ) {
			var detalhe = funLogs[x].detalhes;
			var suprimento = 'Não';
			var transporte = 'Não';
			var nome = funLogs[x].funcaoLogistica.nome;
			var pontos = funLogs[x].pontosCriticos;
			var obs = funLogs[x].observações;
			
			
			if( funLogs[x].funcaoLogistica.isSuprimento === true ) suprimento = 'Sim';
			if( funLogs[x].funcaoLogistica.isTransporte === true ) transporte = 'Sim';
			if( !obs ) obs = '';
			if( !pontos ) pontos = '';
			
			table = table + "<tr class='dataWindowLine'><td class='lineSeparator' colspan='6'>"+detalhe+"</td></tr>";
			table = table + "<tr class='dataWindowLine'><td class='dataWindowAttibute'>Nome</td><td class='dataWindowValue'>"+nome+"</td>"+
                "<td class='dataWindowAttibute'>Suprimento</td><td class='dataWindowValue'>"+suprimento+"</td>" +
                "<td class='dataWindowAttibute'>Transporte</td><td class='dataWindowValue'>"+transporte+"</td></tr>";
			
			table = table + "<tr class='dataWindowLine'><td class='dataWindowAttibute'>Pontos Críticos</td><td colspan='5' class='dataWindowValue'>"+pontos+"</td></tr>";			
			table = table + "<tr class='dataWindowLine'><td class='dataWindowAttibute'>Observações</td><td colspan='5' class='dataWindowValue'>"+obs+"</td></tr>";			
			
		}
		
		table = table + "</table>";
		return table;
		
	},

	
	getProdutosTab : function( data ) {
		var produtos = data.produtosPanel;
		if( produtos.length == 0 ) {
			return this.noData();
		}
		
		var interesseArr = [];
		interesseArr[0] = "Não Definido";
		interesseArr[1] = "Mobilizável";
		interesseArr[2] = "Estratégico";
		
		var table = "<table style='width:100%;' class='dataWindow'>";
		for (x=0; x < produtos.length; x++ ) {
			var produto = produtos[x].produto;
			var nome = produto.nome;
			var interesse = produto.interesse;
			var classeSuprimento = produto.classeSuprimento.classeDescricao;
			var periodicidade = produtos[x].unidadeTempo.nome;
			var capacidadeAtual = produtos[x].orgProdutoServico.producaoAtual;
			var capacidadeAtual = produtos[x].orgProdutoServico.producaoMaxima;
			
			table = table + "<tr class='dataWindowLine'><td class='lineSeparator' colspan='6'>"+nome+"</td></tr>";
			table = table + "<tr class='dataWindowLine'><td class='dataWindowAttibute'>Classe Suprimento</td><td class='dataWindowValue'>"+classeSuprimento+"</td>"+
                "<td class='dataWindowAttibute'>Interesse</td><td class='dataWindowValue'>"+interesseArr[interesse] +"</td>" +
                "<td class='dataWindowAttibute'>Periodicidade</td><td class='dataWindowValue'>"+periodicidade+"</td></tr>";
                
		}
		
		table = table + "</table>";
		return table;
		
	},		
	
	
	getInstalacoesTab : function( data ) {
		var installs = data.instalacoesPanel;
		if( installs.length == 0 ) {
			return this.noData();
		}
		
		var table = "<table style='width:100%;' class='dataWindow'>";
		for (x=0; x < installs.length; x++ ) {
			
			var capacidade = installs[x].capacidade;
			var especialidade = installs[x].especialidade;
			var nome = installs[x].nome;
			
			if ( installs[x].recusouInformar === true ) {
				var table = "<table style='width:100%;' class='dataWindow'>";
				table = table + "<tr class='dataWindowLine'><td class='lineSeparator' colspan='6'>Recusou Informar</td></tr>";
				table = table + "</table>";
				return table;
			}
			
			table = table + "<tr class='dataWindowLine'><td class='lineSeparator' colspan='6'>"+nome+"</td></tr>";
			table = table + "<tr class='dataWindowLine'><td class='dataWindowAttibute'>Especialidade</td><td class='dataWindowValue'>"+especialidade+"</td>"+
                "<td class='dataWindowAttibute'>Capacidade</td><td class='dataWindowValue'>"+capacidade +"</td>" +
                "<td class='dataWindowValue'>&nbsp;</td><td class='dataWindowValue'>&nbsp;</td></tr>";
		}
		
		table = table + "</table>";
		return table;
		
	},	


	getAcordosTab : function( data ) {
		var acordos = data.acordosAdministrativosPanel;
		if( acordos.length == 0 ) {
			return this.noData();
		}
		
		var table = "<table style='width:100%;' class='dataWindow'>";
		for (x=0; x < acordos.length; x++ ) {
			var dataInicio = acordos[x].dataInicio;
			var dataFim = acordos[x].dataFim;
			var descricao = acordos[x].descricao;
			var obs = acordos[x].observacoes;
			

			table = table + "<tr class='dataWindowLine'><td class='lineSeparator' colspan='6'>"+descricao+"</td></tr>";
			table = table + "<tr class='dataWindowLine'><td class='dataWindowAttibute'>Data Início</td><td class='dataWindowValue'>"+dataInicio+"</td>"+
                "<td class='dataWindowAttibute'>Data Fim</td><td class='dataWindowValue'>"+ dataFim +"</td>" +
                "<td class='dataWindowValue'>&nbsp;</td><td class='dataWindowValue'>&nbsp;</td></tr>";
			
			table = table + "<tr class='dataWindowLine'><td class='dataWindowAttibute'>Observações</td><td colspan='5' class='dataWindowValue'>"+obs+"</td></tr>";
		}
		
		table = table + "</table>";
		return table;		
	},
	
	
	getServicosTab : function( data ) {
		var servicos = data.servicosPanel;
		if( servicos.length == 0 ) {
			return this.noData();
		}
		
		var interesseArr = [];
		interesseArr[0] = "Não Definido";
		interesseArr[1] = "Mobilizável";
		interesseArr[2] = "Estratégico";		
		
		var table = "<table style='width:100%;' class='dataWindow'>";
		for (x=0; x < servicos.length; x++ ) {
			var nome = servicos[x].orgProdutoServico.nome;
			var funcao = servicos[x].orgProdutoServico.funcaoLogistica.nome;
			var periodicidade = servicos[x].unidadeTempo.nome; 
			var interesse = servicos[x].orgProdutoServico.interesse;
			var capMaxima = servicos[x].producaoMaxima;
			var capAtual = servicos[x].producaoAtual;
			
			table = table + "<tr class='dataWindowLine'><td class='lineSeparator' colspan='6'>"+nome+"</td></tr>";
			table = table + "<tr class='dataWindowLine'><td class='dataWindowAttibute'>Função Logística</td><td class='dataWindowValue'>"+funcao+"</td>"+
                "<td class='dataWindowAttibute'>Interesse</td><td class='dataWindowValue'>"+interesseArr[interesse] +"</td>" +
                "<td class='dataWindowAttibute'>Periodicidade</td><td class='dataWindowValue'>"+periodicidade+"</td></tr>";
			
			table = table + "<tr class='dataWindowLine'><td class='dataWindowAttibute'>Cap. Fornecimento Atual</td><td class='dataWindowValue'>"+capAtual+"</td>"+
            "<td class='dataWindowAttibute'>Cap. Fornecimento Máxima</td><td class='dataWindowValue'>"+capMaxima +"</td>" +
            "<td class='dataWindowValue'>&nbsp;</td><td class='dataWindowValue'>&nbsp;</td></tr>";
			
			
		}
		
		table = table + "</table>";
		return table;
		
	},	
	
	
	getCapLogTab : function( data ) {
		var capLogs = data.capacidadesLogisticasPanel;
		if( capLogs.length == 0 ) {
			return this.noData();
		}
		
		var table = "<table style='width:100%;' class='dataWindow'>";
		for (x=0; x < capLogs.length; x++ ) {
			
			var tipoCapacidade = capLogs[x].tipoCapacidadeLogistica.nome;
			var interesse = 'Não';
			var quantidade = capLogs[x].quantidade;
			var descricao = capLogs[x].descricao;
			var obs = capLogs[x].obs;
			var unidade = capLogs[x].unidadeMedida.sigla;
			
			if ( capLogs[x].tipoCapacidadeLogistica.interesseDefesa === true ) interesse = 'Sim';
			
			table = table + "<tr class='dataWindowLine'><td class='lineSeparator' colspan='6'>"+tipoCapacidade+"</td></tr>";
			table = table + "<tr class='dataWindowLine'><td class='dataWindowAttibute'>Descrição</td><td class='dataWindowValue'>"+descricao+"</td>"+
                "<td class='dataWindowAttibute'>Quantidade</td><td class='dataWindowValue'>"+quantidade+ " " + unidade +"</td>" +
                "<td class='dataWindowAttibute'>Interesse</td><td class='dataWindowValue'>"+interesse+"</td></tr>";
			
			table = table + "<tr class='dataWindowLine'><td class='dataWindowAttibute'>Observações</td><td colspan='5' class='dataWindowValue'>"+obs+"</td></tr>";
		}
		
		table = table + "</table>";
		return table;
		
	},
	
	
	getTelefoneTab : function( data ) {
		
		
		var telefones = data.telefonePanel;
		if( telefones.length == 0 ) {
			return this.noData();
		}
		
		var table = "<table style='width:100%;' class='dataWindow'>";
		for (x=0; x< telefones.length; x++ ) {
			var setor = telefones[x].setor;
			var telefone = telefones[x].telefone;
			
			var principal = 'Não';
			if ( telefones[x].principal === true ) principal = 'Sim'; 
				
			table = table + "<tr class='dataWindowLine'><td class='dataWindowAttibute'>Setor</td><td class='dataWindowValue'>"+setor+"</td>"+
            	"<td class='dataWindowAttibute'>Telefone</td><td class='dataWindowValue'>"+telefone+"</td>" +
            	"<td class='dataWindowAttibute'>Principal</td><td class='dataWindowValue'>"+principal+"</td></tr>";
			
		}

		table = table + "</table>";
		return table;
	},
	
	getContatoTab : function( data ) {
		var contatos = data.contatoPanel;
		
		if( contatos.length == 0 ) {
			return this.noData();
		}

		var table = "<table style='width:100%;' class='dataWindow'>";
		for (x=0; x< contatos.length; x++ ) {
			var contato = contatos[x];
			var nome = contato.nome;
			var cargo = contato.cargo;
			var celular = contato.celular;
			var email = contato.email;
			var telefone = contato.telefone;
			var princContato = contato.stringPrincipalContato;

			table = table + "<tr class='dataWindowLine'><td class='lineSeparator' colspan='6'>"+nome+ " (" + cargo + ")</td></tr>";
			table = table + "<tr class='dataWindowLine'><td class='dataWindowAttibute'>Telefones</td><td class='dataWindowValue'>Fixo: "+telefone+"<br>Celular: " + celular + "</td>"+
                "<td class='dataWindowAttibute'>Email</td><td class='dataWindowValue'>"+email+"</td>" +
                "<td class='dataWindowAttibute'>Contato Principal</td><td class='dataWindowValue'>"+princContato+"</td></tr>";
			
		}
		
		table = table + "</table>";
		return table;
	},
	
	getInfoTab : function( jsonData ) {
		
		console.log( jsonData );
		return "Nada";
		
		var tipoOrg = 'MIL';

		var data = jsonData.informacoesPanel;
		var dadosGerais = data.dadosGeraisSubPanel;
		var endereco = data.enderecoSubPanel;
		var compl = data.informacoesComplementaresSubPanel;
		var ramosAtividade = data.ramoAtividadeSubPanel;
		
		var homeCare = '';
		var tipoEvacuacaoMedica = '';
		var tipoEstabSaude = '';

		var dadosEstabSaude = data.dadosEstabSaudeSubPanel;
		if ( dadosEstabSaude ) {
			tipoEvacuacaoMedica = dadosEstabSaude.tipoEvacuacaoMedica;
			tipoEstabSaude = dadosEstabSaude.tipoEstabSaude;
			servicoHomeCare = dadosEstabSaude.servicoHomeCare;
			if ( servicoHomeCare === true ) {
				homeCare = 'Sim';
			} else {
				homeCare = 'Não';
			}
		}
		
		
		var dadosGeraisHTML = '';
		
		// Todos
		var cnpj = dadosGerais.cnpj;
		
		// Org MIL
		if ( tipoOrg == 'MIL' ) {
			var restricao = dadosGerais.restricao;
			var validadeDataPosicaoOperativa = dadosGerais.validadeDataPosicaoOperativa;
			var situacaoOperacional = dadosGerais.situacaoOperacional;
			var isOperativa = 'Não';
			if ( dadosGerais.operativa === true ) isOPerativa = 'Sim';
			var comImSup = dadosGerais.nomeComandoSuperiorOperacional;
			var longitudeOperativa = dadosGerais.longitudeOperativa;
			var simboloOperativa = dadosGerais.simboloOperativa;
			var corOperativa = dadosGerais.corOperativa;
			var indicativo = dadosGerais.indicativo;
			var nomeSimboloOperativa = dadosGerais.nomeSimboloOperativa;
			var codigoOm = dadosGerais.codigoOm;
			var dataPosicaoOperativa = dadosGerais.dataPosicaoOperativa;
			var nomeForca = dadosGerais.nomeForca;
			var comImTec = dadosGerais.nomeComandoSuperiorTecnico;			
			var latitudeOperativa = dadosGerais.latitudeOperativa;
			var tipoOm = dadosGerais.tipoOm;
			var dataHora = dadosGerais.dataHora;
			var isProntoEmprego = 'Não';
			if ( dadosGerais.prontoEmprego === true ) isProntoEmprego = 'Sim';
			
			var sigla = dadosGerais.sigla;
			var nome = dadosGerais.nome;
			var codigoUgr = dadosGerais.codigoUgr;
			
			dadosGeraisHTML = "<tr class='dataWindowLine'><td class='lineSeparator' colspan='6'>Dados Gerais</td></tr>";
			dadosGeraisHTML = dadosGeraisHTML + "<tr class='dataWindowLine'><td class='dataWindowAttibute'>Nome</td><td colspan='5' class='dataWindowValue'>"+nome+"</td></tr>" +
					"<tr class='dataWindowLine'><td class='dataWindowAttibute'>Código OM</td><td class='dataWindowValue'>"+codOM+"</td>" +
					                      "<td class='dataWindowAttibute'>Sigla</td><td class='dataWindowValue'>"+sigla+"</td>" +
					                      "<td class='dataWindowAttibute'>Código UGR</td><td class='dataWindowValue'>"+codUGR+"</td></tr>";
			dadosGeraisHTML = dadosGeraisHTML + "<tr class='dataWindowLine'><td class='dataWindowAttibute'>Força</td><td colspan='5' class='dataWindowValue'>"+forca+"</td>";

			dadosGeraisHTML = dadosGeraisHTML + "<tr class='dataWindowLine'><td class='dataWindowAttibute'>CNPJ</td><td class='dataWindowValue'>"+cnpj+"</td>" +
					                      "<td class='dataWindowAttibute'>Tipo OM</td><td class='dataWindowValue'>"+tipoOm+"</td>" +
					                      "<td class='dataWindowAttibute'>Operativa</td><td class='dataWindowValue'>"+isOperativa+"</td></tr>";
			
			dadosGeraisHTML = dadosGeraisHTML + "<tr class='dataWindowLine'><td class='dataWindowAttibute'>Com. Sup. Operacional</td><td colspan='5' class='dataWindowValue'>"+comImSup+"</td></tr>" +
					                      "<tr><td class='dataWindowAttibute'>Com. Sup. Técnico</td><td colspan='5' class='dataWindowValue'>"+comImTec+"</td></tr>";
			
			
		}
		// ====================================================================================
		// Publica
		if ( tipoOrg === 'PUB' ) {
			var sigla = dadosGerais.sigla;
			var nome = dadosGerais.nome;
			var tipo = dadosGerais.tipo;
			var esferaAdministrativa = dadosGerais.esferaAdministrativa;
			var codigoUgr = dadosGerais.codigoUgr;

			dadosGeraisHTML = "<tr class='dataWindowLine'><td class='lineSeparator' colspan='6'>Dados Gerais</td></tr>";
			dadosGeraisHTML = dadosGeraisHTML + "<tr class='dataWindowLine'><td class='dataWindowAttibute'>Nome</td><td colspan='5' class='dataWindowValue'>"+nome+"</td></tr>" +
					"<tr class='dataWindowLine'><td class='dataWindowAttibute'>Código OM</td><td class='dataWindowValue'>"+codOM+"</td>" +
					                      "<td class='dataWindowAttibute'>Sigla</td><td class='dataWindowValue'>"+sigla+"</td>" +
					                      "<td class='dataWindowAttibute'>Código UGR</td><td class='dataWindowValue'>"+codUGR+"</td></tr>";
			
			
		}
		// ====================================================================================

		if ( tipoOrg === 'PRIV' ) {
			var tipo = dadosGerais.tipo;
			var tipocapital = dadosGerais.tipocapital;
			var nomeFantasia = dadosGerais.nomeFantasia;
			var sicaf = dadosGerais.sicaf;
			var empresaInteresseDefesa = dadosGerais.empresaInteresseDefesa;
			var comprasNet = dadosGerais.comprasNet;
			var empresaEstrategiaDefesa = dadosGerais.empresaEstrategiaDefesa;
			var razaoSocial = dadosGerais.razaoSocial;
			
			var isInteresseDefesa = 'Não';
			if ( empresaInteresseDefesa === true ) isInteresseDefesa = 'Sim';			
			var isEstrategiaDefesa = 'Não';
			if ( empresaEstrategiaDefesa === true ) isEstrategiaDefesa = 'Sim';		
			
			
		}

		
		
		
		// ====================================================================================
		var cep = endereco.cep;
		var logradouro = endereco.logradouro;
		var numeroEnd = endereco.numero;
		var complemento = endereco.complemento;
		var bairro = endereco.bairro;
		var pais = endereco.pais;
		var estado = endereco.estado;
		var cidade = endereco.cidade;
		var coordenadas = endereco.longitude + " " + endereco.latitude;
		
		var comandante = compl.comandante;
		var efetivoOficiais = compl.efetivoOficiais; 	
		var efetivoPracas = compl.efetivoPracas;
		var solServLog = 'Não';
		var subordinacao = compl.subordinacao;
		var designacao = compl.designacao;
		var caractNotaveis = compl.caracteristicasNotaveis; 
		var paginaWeb = compl.linkWeb;
		var corMapa = compl.corMapa;
		
		if( !comImSup ) comImSup = '';
		if( !comImTec ) comImTec = '';
		
		var table = "<table style='width:100%;' class='dataWindow'>";

		table = table + dadosGeraisHTML;
		
		
		table = table + "<tr class='dataWindowLine'><td class='lineSeparator' colspan='6'>Endereço</td></tr>";
		table = table + "<tr class='dataWindowLine'><td class='dataWindowAttibute'>CEP</td><td class='dataWindowValue'>"+cep+"</td>" +
		  	                          "<td class='dataWindowAttibute'>Logradouro</td><td class='dataWindowValue'>"+logradouro+"</td>" +
				                      "<td class='dataWindowAttibute'>Número</td><td class='dataWindowValue'>"+numeroEnd+"</td></tr>";
		
		table = table + "<tr class='dataWindowLine'><td class='dataWindowAttibute'>Complemento</td><td class='dataWindowValue'>"+complemento+"</td>" +
				                      "<td class='dataWindowAttibute'>Bairro</td><td class='dataWindowValue'>"+bairro+"</td>" +
				                      "<td class='dataWindowAttibute'>País</td><td class='dataWindowValue'>"+pais+"</td></tr>";
		
		table = table + "<tr class='dataWindowLine'><td class='dataWindowAttibute'>Estado</td><td class='dataWindowValue'>"+estado+"</td>" +
				                      "<td class='dataWindowAttibute'>Cidade</td><td class='dataWindowValue'>"+cidade+"</td>" +
				                      "<td class='dataWindowAttibute'>Coordenadas</td><td class='dataWindowValue'>"+coordenadas+"</td></tr>";

		
		if ( dadosEstabSaude ) {
			table = table + "<tr class='dataWindowLine'><td class='lineSeparator' colspan='6'>Dados Estab. Saúde</td></tr>";
			table = table + "<tr class='dataWindowLine'><td class='dataWindowAttibute'>Tipo Estab. Saúde</td><td class='dataWindowValue'>"+tipoEstabSaude+"</td>" +
            			"<td class='dataWindowAttibute'>Tipo Evac. Médica</td><td class='dataWindowValue'>"+tipoEvacuacaoMedica+"</td>" +
            			"<td class='dataWindowAttibute'>Serv. Home Care</td><td class='dataWindowValue'>"+homeCare+"</td></tr>";
			
		}
		
		
		table = table + "<tr class='dataWindowLine'><td class='lineSeparator' colspan='6'>Informações Complementares</td></tr>";
		table = table + "<tr class='dataWindowLine'><td class='dataWindowAttibute'>Comandante</td><td colspan='5' class='dataWindowValue'>"+comandante+"</td>";

		table = table + "<tr class='dataWindowLine'><td class='dataWindowAttibute'>Efetivo Oficiais</td><td class='dataWindowValue'>"+efetivoOficiais+"</td>" +
									  "<td class='dataWindowAttibute'>Efetivo Praças</td><td class='dataWindowValue'>"+efetivoPracas+"</td>" + 
                                	  "<td class='dataWindowValue'>&nbsp;</td><td class='dataWindowValue'>&nbsp;</td></tr>";
		
		table = table + "<tr class='dataWindowLine'><td class='dataWindowAttibute'>Designação</td><td class='dataWindowValue'>"+designacao+"</td>" +
				                      "<td class='dataWindowAttibute'>Subordinação</td><td class='dataWindowValue'>"+subordinacao+"</td>" +
				                      "<td class='dataWindowAttibute'>Sol. Serv. Logísticos</td><td class='dataWindowValue'>"+solServLog+"</td></tr>";
		
		table = table + "<tr class='dataWindowLine'><td class='dataWindowAttibute'>Cor no Mapa</td><td class='dataWindowValue'>"+corMapa+"</td>" +
				                      "<td class='dataWindowAttibute'>Página WEB</td><td class='dataWindowValue'>"+paginaWeb+"</td>" +
				                      "<td class='dataWindowAttibute'>Carac. Notáveis</td><td class='dataWindowValue'>"+caractNotaveis+"</td></tr>";
		
		table = table + "<tr class='dataWindowLine'><td class='lineSeparator' colspan='6'>Ramos de Atividade</td></tr>";
		
		
		for (x=0; x < ramosAtividade.length; x++ ) {
			var ramoAtt = ramosAtividade[x];
			var table = table + "<tr class='dataWindowLine'><td class='dataWindowAttibute'>Descrição</td><td class='dataWindowValue'>"+ramoAtt+"</td></tr>";
		}
		
		
		
		table = table + "<tr class='dataWindowLine'><td class='lineSeparator' colspan='6'>Participação no Processo de Empresas Mobilizáveis</td></tr>";
		table = table + "<tr class='dataWindowLine'><td class='dataWindowAttibute'>&nbsp;</td><td class='dataWindowValue'>&nbsp;</td><td class='dataWindowAttibute'>&nbsp;</td><td class='dataWindowValue'>&nbsp;</td><td class='dataWindowAttibute'>&nbsp;</td><td class='dataWindowValue'>&nbsp;</td></tr>";
		
		table = table + "<tr class='dataWindowLine'><td class='lineSeparator' colspan='6'>Responsabilidade pelo Cadastro</td></tr>";
		table = table + "<tr class='dataWindowLine'><td class='dataWindowAttibute'>&nbsp;</td><td class='dataWindowValue'>&nbsp;</td><td class='dataWindowAttibute'>&nbsp;</td><td class='dataWindowValue'>&nbsp;</td><td class='dataWindowAttibute'>&nbsp;</td><td class='dataWindowValue'>&nbsp;</td></tr>";

		table = table + "</table>";
		
		return table;
	},
	
	getLeitos : function(data) {
		var leitos = data.leitosPanel;
		if( !leitos ) return true;
		
		if( leitos.length == 0 ) {
			return this.noData();
		}

		var table = "<table style='width:100%;' class='dataWindow'>";
		for (x=0; x< leitos.length; x++ ) {
			var leito = leitos[x];
			
			var codigo = leito.codigo;
			var orgid = leito.orgid;
			var quantidade = leito.quantidade;
			var quantidadeSus = leito.quantidadeSus;
			var descricao = leito.tipoLeito.descricao;
			
			
			table = table + "<tr class='dataWindowLine'><td class='lineSeparator' colspan='6'>"+descricao+"</td></tr>";
			table = table + "<tr class='dataWindowLine'><td class='dataWindowAttibute'>Qtd Total</td><td class='dataWindowValue'>"+quantidade+"</td>"+
                "<td class='dataWindowAttibute'>Email</td><td class='dataWindowValue'>"+email+"</td>" +
                "<td class='dataWindowAttibute'>Contato Principal</td><td class='dataWindowValue'>"+princContato+"</td></tr>";
			
		}
		
		table = table + "</table>";
		return table;
		
		
		
	},
	getEquipamentos : function(data) {
		
	},
	getEpecialidades : function(data) {
		
	},
	
	// -----------------------------------------------------------------------------------------
	makeWindow : function( data, record ) {
		
		var orgMilWindow = Ext.getCmp('orgMilWindow');
		if( !orgMilWindow ) {
			orgMilWindow = Ext.create('MCLM.view.apolo.orgmil.OrgMilWindow');
		}
		
		//orgMilWindow.geometry = Ext.decode( record.mclm_metadata_property.features[0] );
		
		Ext.getCmp('orgMilTabContainer').add( this.createTab('Informações', this.getInfoTab(data) ) );
		
		Ext.getCmp('orgMilTabContainer').add( this.createTab('Leitos', this.getLeitos(data) ) );
		Ext.getCmp('orgMilTabContainer').add( this.createTab('Equipamentos', this.getEquipamentos(data) ) );
		Ext.getCmp('orgMilTabContainer').add( this.createTab('Especialidades', this.getEpecialidades(data) ) );
		
		Ext.getCmp('orgMilTabContainer').add( this.createTab('Contato', this.getContatoTab(data) ) );
		Ext.getCmp('orgMilTabContainer').add( this.createTab('Telefone', this.getTelefoneTab(data) ) );
		Ext.getCmp('orgMilTabContainer').add( this.createTab('Fun. Log.', this.getFunLogTab(data) ) );
		Ext.getCmp('orgMilTabContainer').add( this.createTab('Cap. Log.', this.getCapLogTab(data) ) );
		Ext.getCmp('orgMilTabContainer').add( this.createTab('Instalações', this.getInstalacoesTab(data) ) );
		Ext.getCmp('orgMilTabContainer').add( this.createTab('Produtos', this.getProdutosTab(data) ) );
		Ext.getCmp('orgMilTabContainer').add( this.createTab('Serviços', this.getServicosTab(data) ) );
		Ext.getCmp('orgMilTabContainer').add( this.createTab('Acordos Adm.', this.getAcordosTab(data) ) );
		
		orgMilWindow.show();
			
	},
	// -----------------------------------------------------------------------------------------
	

});

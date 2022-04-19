var WDG_CANCELAR_SOLICITACOES = SuperWidget.extend({
    LISTA_PROCESSO: [],
    
    bindings: {
        local: {
            'adicionar-processo': ['click_fnAdicionarProcesso'],
            'cancelar-solicitacoes': ['click_fnConsultarCancelarSolicitacoes']
        },
        global: {}
    },

    init: function() {
        FLUIGC.calendar(`#dataInicio_${this.instanceId}`);
        FLUIGC.calendar(`#dataFim_${this.instanceId}`);
        const slProcessos = $(`#processo_${this.instanceId}`);
        const processos = DatasetFactory.getDataset("processDefinition", null, null, null);
        
        for (let processo of processos.values){
            slProcessos.append($("<option>", {
                value: processo["processDefinitionPK.processId"],
                text: processo["processDescription"]
            }));
        }
        
        this.fnCarregarTabelaProcessos(this.LISTA_PROCESSO);
    },

    fnCarregarTabelaProcessos: function(registros) {
        this.TABELA_PROCESSOS = FLUIGC.datatable(`#tabela_processos_${this.instanceId}`, {
            renderContent: '.template_registro_tabela_processos',
            classSelected: 'info',
            tableStyle: 'table-condensed table-hover',
            dataRequest: registros,
            header: [
                { 'title': 'Código' },
                { 'title': 'Descrição' },
                { 'title': 'Solicitação início'},
                { 'title': 'Solicitação fim' },
                { 'title': 'Data início' },
                { 'title': 'Data fim' }
            ],
            search: {
                enabled: false,
            },
            navButtons: {
                enabled: false,
            }
        });

        this.LISTA_PROCESSO = this.TABELA_PROCESSOS.getData();
    },

    fnAdicionarProcesso: function(htmlElement, event) {
        if(this.fnValidarCampos()) return;

        const processoCodigo = $(`#processo_${this.instanceId}`).val();
        const processoDescricao = $(`#processo_${this.instanceId} :selected`).text();
        const solicitacaoInicio = $(`#solicitacaoInicio_${this.instanceId}`).val();
        const solicitacaoFim = $(`#solicitacaoFim_${this.instanceId}`).val();
        const dataInicio = $(`#dataInicio_${this.instanceId}`).val();
        const dataFim = $(`#dataFim_${this.instanceId}`).val();

        if(this.fnExisteProcessoNaTabela(processoCodigo)) return;

        const indice = this.LISTA_PROCESSO.length;
        this.TABELA_PROCESSOS.addRow(indice, {
            processoCodigo : processoCodigo,
            processoDescricao : processoDescricao,
            solicitacaoInicio : solicitacaoInicio,
            solicitacaoFim : solicitacaoFim,
            dataInicio : dataInicio,
            dataFim : dataFim
        });

        this.TABELA_PROCESSOS.reload();
        this.LISTA_PROCESSO = this.TABELA_PROCESSOS.getData();
    },

    fnExisteProcessoNaTabela: function(processoCodigo) {
        const processo = this.LISTA_PROCESSO.find((item) => {
            return item.processoCodigo == processoCodigo;
        });

        const condicao = (processo != undefined);

        if(condicao) {
            FLUIGC.toast({
                title: 'Alerta: ',
                message: `O processo "${processo.processoDescricao}" já existe na lista!`,
                type: 'warning'
            });
        }

        return condicao;
    },

    fnValidarCampos: function() {
        let resultado = false;
        const campos = [
            "processo",
            "solicitacaoInicio",
            "solicitacaoFim",
            "dataInicio",
            "dataFim"
        ];

        for(let campo of campos) {
            const conteudo = $(`#${campo}_${this.instanceId}`).val();
            const label = `label[for="${campo}_${this.instanceId}"]`;

            $(label).css("color", "");
            if (this.isEmpty(conteudo)) {
                const labelConteudo = $(label).text();

                resultado = true;

                FLUIGC.toast({
                    title: 'Alerta: ',
                    message: `"${labelConteudo}" está vazio, por favor preencha antes de prosseguir!`,
                    type: 'warning'
                });

                $(label).css("color", "#ff0000");
            }
        }

        return resultado;
    },

    fnConsultarCancelarSolicitacoes(htmlElement, event) {
        const that = this;
        const processos = this.LISTA_PROCESSO;

        for(let processo of processos) {
            const constraints = [];

            constraints.push(
                DatasetFactory.createConstraint(
                    "processId", 
                    processo.processoCodigo, 
                    processo.processoCodigo, 
                    ConstraintType.MUST
                )
            );


            constraints.push(
                DatasetFactory.createConstraint(
                    "workflowProcessPK.processInstanceId", 
                    processo.solicitacaoInicio, 
                    processo.solicitacaoFim, 
                    ConstraintType.MUST
                )
            );

            constraints.push(
                DatasetFactory.createConstraint(
                    "startDateProcess", 
                    processo.dataInicio, 
                    processo.dataFim, 
                    ConstraintType.MUST
                )
            );

            // Filtrar todas as solicitações que não estão canceladas ou finalizadas
            constraints.push(
                DatasetFactory.createConstraint(
                    "active", 
                    "true", 
                    "true", 
                    ConstraintType.MUST
                )
            );

            const fields = [
                "requesterId",
                "workflowProcessPK.processInstanceId"
            ];

            DatasetFactory.getDataset("workflowProcess", fields, constraints, null, {
                success: function(data) {
                    if(that.isNotEmpty(data)) {
                        that.fnCancelarSolicitacoes(data.values, processo.processoDescricao);
                    }
                },
                error: function(jqXHR, textStatus, errorThrown) {
                    console.log(jqXHR, textStatus, errorThrown);
                }
            });
        }
    },

    fnCancelarSolicitacoes(registros, processoDescricao) {
        if(this.isEmpty(registros)) return;

        const cancelInstanceList = registros.map((item) => {
            return {
                processInstanceId: item["workflowProcessPK.processInstanceId"],
                replacedId: item["requesterId"],
                cancelText: "Cancelado automaticamente \"WDG CANCELAR SOLICITAÇÕES\""
            }
        });
        
        const dados = {
            cancelInstanceList: cancelInstanceList
        }

        WCMAPI.Read({
    		type: "POST",
    		async: true,
    		url: '/api/public/2.0/workflows/cancelInstances',
    	    contentType: "application/json",
    	    dataType: "json",
    	    data: JSON.stringify(dados),
    	    success: function(data) {
                console.log(data);
    	    	alert("dados criados com sucesso");
                FLUIGC.toast({
                    title: 'Sucesso',
                    message: `As solicitações do processo "${processoDescricao}" foram canceladas!`,
                    type: 'success'
                });
    	    }
    	});
    },

    isEmpty: function(value) {
        return value == undefined || value == null || value == "";
    },

    isNotEmpty(value) {
        return !this.isEmpty(value);
    }

});

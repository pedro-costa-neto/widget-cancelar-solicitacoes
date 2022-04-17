var WDG_CANCELAR_SOLICITACOES = SuperWidget.extend({
    LISTA_PROCESSO: [],
    
    bindings: {
        local: {
            'adicionar-processo': ['click_fnAdicionarProcesso']
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

    fnCancelarSolicitacoes(registros) {
        
        // {
        //     cancelInstanceList: [ 
        //         {
        //             processInstanceId: 1, //Process instance id 
        //             cancelText: "Canceled as a replacement", //Cancel text 
        //             replacedId: "usr" //User id from the replaced cancel process instance
        //         }
        //     ]
        // }
    },

    isEmpty: function(value) {
        return value == undefined || value == null || value == "";
    }

});
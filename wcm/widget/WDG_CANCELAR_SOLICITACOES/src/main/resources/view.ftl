<div id="WDG_CANCELAR_SOLICITACOES_${instanceId}" class="super-widget wcm-widget-class fluig-style-guide" data-params="WDG_CANCELAR_SOLICITACOES.instance()">

    <div class="row">

        <div class="col-md-4 form-group">
            <label for="processo_${instanceId}">
                <strong>Processo</strong>
            </label>
            <input type="hidden" id="editar_indice_${instanceId}" >
            <select class="form-control" id="processo_${instanceId}">
                <option value="">Selecionar</option>
            </select>		
        </div>
        
        <div class="col-md-2 form-group">
            <label for="solicitacaoInicio_${instanceId}">
                <strong>Solicitação início</strong>
            </label>
            <input type="number" class="form-control" id="solicitacaoInicio_${instanceId}" min="0" max="999999999" maxlength="9" value="0">		
        </div>
        
        <div class="col-md-2 form-group">
            <label for="solicitacaoFim_${instanceId}">
                <strong>Solicitação fim</strong>
            </label>
            <input type="number" class="form-control" id="solicitacaoFim_${instanceId}" min="0" max="999999999" maxlength="9" value="999999999">		
        </div>
        
        <div class="col-md-2 form-group">
            <label for="dataInicio_${instanceId}">
                <strong>Data início</strong>
            </label>
            <input type="text" class="form-control" id="dataInicio_${instanceId}">		
        </div>
        
        <div class="col-md-2 form-group">
            <label for="dataFim_${instanceId}">
                <strong>Data fim</strong>
            </label>
            <input type="text" class="form-control" id="dataFim_${instanceId}">		
        </div>
    
    </div>
    
    <div class="row">

        <div class="col-md-12 form-group">
            <button type="button" class="btn btn-success" style="float: right;" data-adicionar-processo>Salvar</button>
            <button type="button" class="btn btn-info" id="btn_editar_${instanceId}" data-editar-registro>Editar</button>
            <button type="button" class="btn btn-warning" id="btn_excluir_${instanceId}" data-excluir-registros>Excluir</button>
            <button type="button" class="btn btn-danger" id="btn_cancelar_${instanceId}" data-cancelar-solicitacoes>Cancelar solicitações</button>
        </div>

    </div>

    <div class="table-responsive">

        <div id="tabela_processos_${instanceId}"></div>
        
    </div>

    <script type="text/javascript" src="/webdesk/vcXMLRPC.js"></script>
</div>

<script type="text/template" class="template_registro_tabela_processos">
    <tr>
        <td>{{processoCodigo}}</td>
        <td>{{processoDescricao}}</td>
        <td>{{solicitacaoInicio}}</td>
        <td>{{solicitacaoFim}}</td>
        <td>{{dataInicio}}</td>
        <td>{{dataFim}}</td>
    </tr>
</script>

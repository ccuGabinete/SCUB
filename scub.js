'use strict';

const e = React.createElement;
const c = console.log;

const logado = {
    cpf: '07658259705',
    nome: 'Nieraldo da Silva Lima'
}


var obSol = {
    cpf: '',
    nome: '',
    idauto: '',
    descricao: '',
    lacre: '',
    dataLacre: '',
    numeroauto: '',
    logradouro: ''
}




if (window.innerWidth < 575) {
    $('#listas').hide();
    $('#card').show();
} else {
    $('#listas').show();
    $('#card').hide();
}




// Área para renderizar o cabeçalho de solicitação
const titulo = e('p', { key: 'titulo' }, 'NOVA SOLICITAÇÃO')
const textoTitulo = e('p', { key: 'textoTitulo' }, 'Uma nova solicitação será avaliada pela Prefeitura em até 7 dias contados da data da apreensão.')
const corpoTextoAviso = e('div', { key: 'corpoTextoAviso' }, [textoTitulo])
const divTitulo = e('div', { key: 'divTitulo', className: 'lableSolicitacoes' }, titulo)




var resLacre = (NumeroAuto, DataApreensao, Logradouro) => {
    class RespostaLacre extends React.Component {
        constructor(props) {
            super(props);
            this.state = { NumeroAuto: NumeroAuto, DataApreensao: moment(DataApreensao).format('DD/MM/YYYY'), Logradouro: Logradouro }


            this.handleChangeDescricao = this.handleChangeDescricao.bind(this);

        }

        componentDidMount() {


            $('#btnEnviarSolicitacao').click(() => {

                let cpf = obSol.cpf;
                let nome = obSol.nome;
                let idauto = obSol.idauto;
                let descricao = 'Descricao: ' + obSol.descricao + ';Data: ' + obSol.dataLacre + ';Lacre: ' + obSol.lacre + ';Auto: ' + obSol.numeroauto + ';Logradouro: ' + obSol.logradouro;

                if (!descricao) {
                    alert('Preencha a Descrição das mercadorias')
                } else if (descricao.length < 50) {
                    alert('Informe mais detalhes para efeturar a solicitação')
                } else {
                    axios
                        .get("http://127.0.0.1:8049/webrunstudio/ZServicoInserirSolicitacao.rule?sys=CCU&CPF=" + cpf + "&NOME=" + nome + "&idAuto=" + idauto + "&DESCRICAO=" + descricao)
                        .then(response => {
                            if (response.data.status === 'error') {
                                c('houve um erro')
                            } else {
                                var res = response.data.dados[0];
                                sucesso();
                                obSol.descricao = null;
                                atualizarHistorico(res.idSolicitacaoMercadoria, 1)
                            }
                        })
                        .catch(error => console.log(error));
                }

            })


        }

        handleChangeDescricao(value) {
            obSol.descricao = event.target.value;
        }

        render() {

            return e('div', { key: 'divLacreRespota' },
                [
                    e('ul', { key: 'listaDadosLacre', className: 'listaRespostaLacre' },
                        [
                            e('li', { key: 'l1' }, 'Data da Apreensão: ' + this.state.DataApreensao),
                            e('li', { key: 'l2' }, 'Número do Auto de Apreensão: ' + this.state.NumeroAuto),
                            e('li', { key: 'l3' }, 'Local da Apreensão: ' + this.state.Logradouro)
                        ]),
                    e('div', { key: 'divDescricao', id: 'descricaolacre' }, e('textarea', { key: 'textareaDescricao', value: this.state.descricao, onChange: this.handleChangeDescricao, className: 'form-control', placeholder: 'Informe uma breve descrição da mercadoria' }, null)),
                    e('button', { key: 'btnEnviarSolicitacao', className: 'btn btn-info btn-lg btn-block', id: 'btnEnviarSolicitacao' }, 'ENVIAR SOLICITAÇÃO')

                ])
        }
    }

    const domContainer = document.querySelector('#divRespostaLacre');
    ReactDOM.render(e(RespostaLacre), domContainer);
}

var solLacre = () => {

    class Lacre extends React.Component {
        constructor(props) {
            super(props);
            this.state = { lacre: '', data: '', descricao: '' }

            this.handleChangeLacre = this.handleChangeLacre.bind(this);
            this.handleChangeDescricao = this.handleChangeDescricao.bind(this);
            this.handleChangeData = this.handleChangeData.bind(this);
        }

        componentDidMount() {
            $('#button-lacre').click(() => {
                if (!this.state.data) {
                    meercadoria
                    alert('Informe a data da apreensão da mercadoria');
                } else if (!this.state.lacre) {
                    alert('Informe o número do lacre');
                } else {
                    obSol.lacre = this.state.lacre;
                    obSol.dataLacre = moment(this.state.data).format('DD/MM/YYYY');

                    axios
                        .get("http://127.0.0.1:8049/webrunstudio/ZServicoBuscarLacre.rule?sys=CCU&LACRE=" + this.state.lacre + "&DATA=" + this.state.data)
                        .then(response => {
                            if (response.data.status === 'error') {
                                alert('Lacre não encontrado. Aguarde 24 horas e tente novamente')
                                $('#divRespostaLacre').empty();
                            } else {
                                var res = response.data.dados[0];
                                obSol.idauto = res.IDAuto;
                                obSol.numeroauto = res.NumeroAuto;
                                obSol.logradouro = res.Logradouro;
                                resLacre(res.NumeroAuto, res.DataApreensao, res.Logradouro);
                            }
                        })
                        .catch(error => console.log(error));
                }

            })
        }

        handleChangeLacre(event) {
            this.setState({ lacre: event.target.value });
        }

        handleChangeDescricao(event) {
            this.setState({ descricao: event.target.value });
        }

        handleChangeData(event) {
            this.setState({ data: event.target.value });
        }

        render() {

            return e('div', { key: 'divPrincipalSolicitacoes' }, [
                divTitulo,
                textoTitulo,
                e('div', { key: 'divData', className: 'form-group' },
                    [
                        e('label', { key: 'labelData' }, 'Data da Apreensão'),
                        e('input', { key: 'inputData', value: this.state.data, onChange: this.handleChangeData, type: 'date', min: '2020-01-01', id: 'datepicker', className: 'form-control' }, null),

                    ]),
                e('div', { key: 'divLacre', className: 'input-group mb-3' },
                    [
                        e('input', { key: 'inputLacre', value: this.state.lacre, onChange: this.handleChangeLacre, className: 'form-control', placeholder: 'Informe o número do lacre', 'aria-label': 'Informe o número do lacre', 'aria-describedby': 'button-addon2' }, null),
                        e('div', { key: 'divlacre', className: 'input-group-append' }, e('button', {
                            key: 'buttonlacre', className: 'btn btn-outline-secondary', type: 'button', id: 'button-lacre'
                        }, 'Consultar'))
                    ]),
                e('div', { key: 'divRespostaLacre', id: 'divRespostaLacre', className: 'divRespostaLacre' }, null)
            ])
        }
    }

    const domContainer = document.querySelector('#conteudo-solicitacao');
    ReactDOM.render(e(Lacre), domContainer);
}

var solDescricao = () => {

    class Descricao extends React.Component {
        constructor(props) {
            super(props);
            this.state = { data: '', local: '', descricao: '' }

            this.handleChangeData = this.handleChangeData.bind(this);
            this.handleChangeLocal = this.handleChangeLocal.bind(this);
            this.handleChangeDescricao = this.handleChangeDescricao.bind(this);

        }

        componentDidMount() {
            $('#buttonDescricao').click(() => {
                if (!this.state.descricao) {
                    alert('Preencha primeiramente uma breve descrição da mercadoria');
                } else if (this.state.descricao.length < 5) {
                    alert('Informe mais detalhes para efeturar a solicitação')
                } else {
                    if (!this.state.data) {
                        alert('Informe a data da preensão');
                    } else if (!this.state.local) {
                        alert('Informe o local da apreensão');
                    } else {

                        let resposta = 'Descrição: ' + this.state.descricao.concat(';Data: ' + moment(this.state.data).format('DD/MM/YYYY') + ';Local: ' + this.state.local);
                        c(resposta);

                        axios
                            .get("http://127.0.0.1:8049/webrunstudio/ZServicoInserirSolicitacaoDescricao.rule?sys=CCU&CPF=" + obSol.cpf + "&NOME=" + obSol.nome + "&DESCRICAO=" + resposta)
                            .then(response => {

                                if (response.data.status === 'error') {
                                    c('houve um erro')
                                } else {
                                    var res = response.data.dados[0];
                                    c(res);
                                    sucesso();
                                    obSol.descricao = null;
                                    atualizarHistorico(res.idSolicitacaoMercadoria, 1)
                                }
                            })
                            .catch(error => console.log(error));

                    }

                }
            })
        }

        handleChangeData(event) {
            this.setState({ data: event.target.value });
        }

        handleChangeLocal(event) {
            this.setState({ local: event.target.value });
        }

        handleChangeDescricao(event) {
            this.setState({ descricao: event.target.value });
        }



        render() {

            return e('div', { key: 'divPrincipalDescricao', className: 'divPrincipalSolicitacoes' },
                [
                    divTitulo,
                    textoTitulo,
                    e('div', { key: 'divData', className: 'form-group' },
                        [
                            e('label', { key: 'labelData' }, 'Data da Apreensão'),
                            e('input', { key: 'inputData', value: this.state.data, onChange: this.handleChangeData, type: 'date', min: '2020-01-01', id: 'datepicker', className: 'form-control' }, null),

                        ]),
                    e('div', { key: 'divLocal', className: 'form-group' },
                        [
                            e('label', { key: 'labelLocal' }, 'Local da Apreensão'),
                            e('input', { key: 'inputLocal', value: this.state.local, onChange: this.handleChangeLocal, type: 'text', className: 'form-control', placeholder: 'Informe o local da apreensão' }, null),

                        ]),
                    e('div', { key: 'divBuscaDescricao', className: 'input-group mb-3' },
                        [
                            e('textarea', { key: 'textareaDescricao', value: this.state.descricao, onChange: this.handleChangeDescricao, className: 'form-control', placeholder: 'Informe uma breve descrição da mercadoria', 'aria-label': 'Informe uma breve descrição da mercadoria', 'aria-describedby': 'button-addon2' }, null),
                            e('div', { key: 'divTituloButtonbuttonDescricao', className: 'input-group-append' }, e('button', { key: 'buttonDescricao', className: 'btn btn-outline-secondary', type: 'button', id: 'buttonDescricao' }, 'Solicitar'))
                        ]),
                    e('div', { key: 'divRespostaDescricao', id: 'divRespostaDescricao' }, null)
                ]);
        }
    }

    const domContainer = document.querySelector('#conteudo-solicitacao');
    ReactDOM.render(e(Descricao), domContainer);
}

const teste = (lacre, data) => {
    alert(lacre + ' - ' + data);
}


const printSolicitacao = (value) => {
    c(value);
    c(obSol);
}

var sucesso = () => {
    class Sucesso extends React.Component {
        constructor(props) {
            super(props);
        }


        render() {
            return e('div', { key: 'sucesso', id: 'sucesso', className: 'sucesso' },
                [
                    e('h1', { key: 'titulosucesso', className: 'sucesso-titulo' }, 'SUCESSO'),
                    e('span', { key: 'textosucesso', className: 'sucesso-texto' }, 'A partir de agora, acompanhe o andamento desta solicitação no menu MINHAS SOLICITAÇÕES'),
                    e('div', { key: Math.random() }, e('button', { key: 'buttonsucesso', className: 'btn btn-link', onClick: () => location.reload() }, 'VER SOLICITAÇÕES'))
                ])
        }
    }

    const domContainer = document.querySelector('#conteudo-solicitacao');
    ReactDOM.render(e(Sucesso), domContainer);

}




class ShowWindowDimensions extends React.Component {
    state = { width: window.innerWidth, height: window.innerHeight };

    updateDimensions = () => {
        this.setState({ width: window.innerWidth, height: window.innerHeight });
        if (this.state.width < 575) {
            $('#listas').hide();
            $('#card').show();

        };

        if (this.state.width >= 575) {
            $('#listas').show();
            $('#card').hide();

        };
    }

    componentDidMount() {
        window.addEventListener('resize', this.updateDimensions);
    }
    componentWillUnmount() {
        window.removeEventListener('resize', this.updateDimensions);
    }

    render() {
        return e('span', {}, null)
    }
}

const domContainer = document.querySelector('#conteudo-solicitacao');
ReactDOM.render(e(ShowWindowDimensions), domContainer);

var consultaSolicitacao = (dados) => {

    class Consulta extends React.Component {
        constructor(props) {
            super(props);
            this.state = { conteudo: dados, idSolicitacaoDevolucao: '' }

            this.handleChange = this.handleChange.bind(this);

        }

        componentDidMount() {

            $('#button-taxa').hide();
            $('#button-recurso').hide();

            this.state.conteudo.forEach(a => {

                if (a.StatusSolciitacao === 'DEFERIDA') {
                    $('#button-taxa').show();
                }

                if (a.StatusSolciitacao === 'INDEFERIDA') {
                    $('#button-recurso').show();
                }
            })

            $('#button-documento-main').click()

            $('#button-documento-main').click(() => {
                $("#button-documento").trigger('click');
            });

        }


        handleChange(value) {
            this.setState({ idSolicitacaoDevolucao: value });
        }

        render() {
            
            let arr = []
            let codigosolicitacao = 0;
            let numeroprocesso = null;
            let arrDescricao;
            let listaArrayDescricao = [];
            let dataSolicitacao;

            // const btnImagem = e('button', { key: Math.random(), className: 'btn btn-light btn-lg btn-block', type: 'button', id: 'button-documento-main' }, 'Inserir Documento')
            // const areaImagem = e('div', { key: Math.random(), className: 'areadaimagem' }, btnImagem)
            // const labledocumentos = e('label', { key: 'labelData' }, 'Inserir notas fiscais ou comprovantes da origem das mercadorias');


            // //Header da tabela acrescentar documentos
            // const cont = e('th', { key: Math.random(), scope: 'row', className: 'coluna' }, ' ');
            // const nomedoc = e('th', { key: Math.random(), scope: 'col', className: 'coluna' }, 'NOME');
            // const acao = e('th', { key: Math.random(), scope: 'col', className: 'coluna' }, 'AÇÃO');
            // const linhatitle = e('tr', { key: Math.random() }, [cont, nomedoc, acao]);
            // const theadImagem = e('thead', { key: Math.random() }, [linhatitle]);

            // //Corpo da tabela acrescentar documentos

            // const dados = [{ NomeArquivo: 'doc1' }, { NomeArquivo: 'doc2' }]
            // let arrImage = [];

            // dados.forEach(
            //     (a, b) => {

            //         const btnexcluir = e('button', { key: Math.random(), className: 'btn btn-link', type: 'button', id: 'button-excluir' }, 'excluir');
            //         const linhanome = e('td', { key: Math.random() }, a.NomeArquivo);
            //         const linhabtnexcluir = e('td', { key: Math.random(), onClick: () => excluirImagem(a.NomeArquivo, codigosolicitacao) }, btnexcluir);
            //         const linhaContador = e('th', { key: Math.random() }, b + 1);
            //         const linhaConteudo = e('tr', { key: Math.random() }, [linhaContador, linhanome, linhabtnexcluir]);
            //         arrImage.push(linhaConteudo);
            //     }
            // )

            // const tbodyImage = e('tbody', { key: Math.random() }, arrImage);
            // const tableImage = e('table', { key: Math.random(), className: 'table table-bordered table-info' }, [theadImagem, tbodyImage]);

            // const areaDocumentos = e('div', { key: Math.random(), className: 'areadocumentos' }, [labledocumentos, areaImagem, tableImage])


            // Área para renderizar o cabeçalho de consulta
            const tituloSolicitar = e('p', { key: Math.random() }, 'CONSULTAR SOLICITAÇÃO')
            const divTituloSolicitar = e('div', { key: Math.random(), className: 'lableSolicitacoes' }, tituloSolicitar)


            //Header da tabela
            const contador = e('th', { key: Math.random(), scope: 'row', className: 'coluna' }, ' ');
            const etapas = e('th', { key: Math.random(), scope: 'col', className: 'coluna' }, 'ETAPA');
            const data = e('th', { key: Math.random(), scope: 'col', className: 'coluna' }, 'DATA');
            const linhaTitulo = e('tr', { key: Math.random() }, [contador, etapas, data]);
            const thead = e('thead', { key: Math.random() }, [linhaTitulo]);

            this.state.conteudo.forEach(
                (a, b) => {

                    arrDescricao = a.Descricao.split(';');
                    numeroprocesso = a.Processo;
                    codigosolicitacao = a.idSolicitacaoMercadoria;
                    dataSolicitacao = a.Data;
                    const linhaData = e('td', { key: Math.random() }, moment(a.Data).format('DD/MM/YYYY'));
                    const linhaEtapa = e('td', { key: Math.random() }, a.StatusSolciitacao);
                    const linhaContador = e('th', { key: Math.random() }, b + 1);
                    const linhaConteudo = e('tr', { key: Math.random() }, [linhaContador, linhaEtapa, linhaData]);
                    arr.push(linhaConteudo)
                });


            if (!numeroprocesso) {
                numeroprocesso = 'Aguardando abertura'
            }

            arrDescricao.forEach(a => {
                let listaDescricao = e('li', { key: Math.random() }, a)
                listaArrayDescricao.push(listaDescricao);
            });

            let corpoListaDescricao = e('div', { key: Math.random(), className: 'detalhamentoConsulta' }, e('ul', { key: Math.random() }, listaArrayDescricao));


            //Corpo da tabela


            const divDetalhamento = e('div', { key: Math.random() },
                [
                    e('span', { key: Math.random(), className: 'datasolicitacao', id: 'codigosolicitacao' }, 'Código da Solicitação: ' + codigosolicitacao),
                    e('span', { key: Math.random(), className: 'statussolicitacao' }, 'Processo: ' + numeroprocesso),
                    e('a', { key: Math.random(), id: 'button-documento-main', className: 'badge badge-light' }, 'Inserir documentos à solcicitação')
                ])
            const tbody = e('tbody', { key: Math.random() }, arr);
            const table = e('table', { key: Math.random(), className: 'table table-bordered table-info' }, [thead, tbody]);
            return e('div', { key: Math.random() }, [divTituloSolicitar, divDetalhamento, corpoListaDescricao, table,
                e('button', { key: Math.random(), className: 'btn btn-link btn-lg btn-block', id: 'button-prazos', onClick: () => carregarPrazos(codigosolicitacao, dataSolicitacao) }, 'Consultar Prazos'),
                e('button', { key: Math.random(), className: 'btn btn-link btn-lg btn-block', id: 'button-taxa', onClick: () => carregaTelaTaxa() }, 'Taxa de Depósito'),
                e('button', { key: Math.random(), className: 'btn btn-link btn-lg btn-block', id: 'button-recurso' }, 'Pedido de Reconsideração')
            ]);
        }
    }

    const domContainer = document.querySelector('#conteudo-solicitacao');
    ReactDOM.render(e(Consulta), domContainer);


    return codigosolicitacao;
}


const buscarSolicitacao = (value) => {
    axios
        .get("http://127.0.0.1:8049/webrunstudio/ZServicoBuscarHistoricos.rule?sys=CCU&ID=" + value)
        .then(response => {
            const res = response.data.dados;
            let codigosolicitacao;

            res.forEach(a => {
                codigosolicitacao = a.idSolicitacaoMercadoria
            })

            PegarIDSolicitacao(codigosolicitacao);
            consultaSolicitacao(res);

        })
        .catch(error => console.log(error));

};

const atualizarHistorico = (IDSOLICITACAO, IDSTATUS, DATA) => {
    axios
        .get("http://127.0.0.1:8049/webrunstudio/ZServicoAtualizarHistorico.rule?sys=CCU&IDSOLICITACAO=" + IDSOLICITACAO + "&IDSTATUS=" + IDSTATUS + "&DATA=" + DATA)
        .then(response => {
            const res = response.data.dados;
        })
        .catch(error => console.log(error));
}



const carregarPrazos = (idSolicitacaoMercadoria, dataSolicitacao) => {

    axios
        .get("http://127.0.0.1:8049/webrunstudio/ZServicoBuscarAuto.rule?sys=CCU&IDSOLICITACAO=" + idSolicitacaoMercadoria)
        .then(response => {

            var obj = {};
            obj.DataSolicitacao = dataSolicitacao;

            if (response.data.status === 'error') {
                obj.Apreensao = null;
                obj.LimiteSolicitacao = null;
                limiteDiasUteis(obj);
            } else {
                const res = response.data.dados[0];
                obj.Apreensao = res.DataApreensao;
                obj.LimiteSolicitacao = res.DataLimite;
                limiteDiasUteis(obj);
            }

        })
        .catch(error => console.log(error));
}


const limiteDiasUteis = (obj) => {
    let data = obj.DataSolicitacao;
    let arrDatas = [];
    let urls = [];

    for (let index = 0; index < 12; index++) {
        data = moment(data).add(1, 'days');
        let semana = moment(data).format('ddd');
        if (semana !== 'sáb' && semana !== 'dom') {
            let obj = { url: 'http://127.0.0.1:8049/webrunstudio/ZServicoBuscarFeriado.rule?sys=CCU&DATA=' + moment(data).format('YYYY-MM-DD'), data: moment(data).format('DD/MM/YYYY') }
            urls.push(obj);
        }
    }

    async function getTodos() {
        for (const [idx, obj] of urls.entries()) {
            const todo = await axios
                .get(obj.url)
                .then(response => {
                    if (response.data.status === "error") {
                        arrDatas.push(obj.data);
                    }
                })
                .catch(error => console.log(error));
        }

        obj['limitedogerente'] = arrDatas[4];

        class Prazos extends React.Component {
            constructor(props) {
                super(props);
                this.state = { value: '' }

                this.handleChange = this.handleChange.bind(this);

            }

            componentDidMount() {

            }


            handleChange(event) {
                this.setState({ value: event.target.value });
            }

            render() {
                const tituloSolicitar = e('p', { key: Math.random() }, 'CONSULTAR PRAZOS DA SOLICITAÇÃO');
                const divTituloSolicitar = e('div', { key: Math.random(), className: 'lableSolicitacoes' }, tituloSolicitar);

                //Header da tabela
                const contador = e('th', { key: Math.random(), scope: 'row', className: 'coluna' }, ' ');
                const etapas = e('th', { key: Math.random(), scope: 'col', className: 'coluna' }, 'ETAPA');
                const data = e('th', { key: Math.random(), scope: 'col', className: 'coluna' }, 'DATA');
                const linhaTitulo = e('tr', { key: Math.random() }, [contador, etapas, data]);
                const thead = e('thead', { key: Math.random() }, [linhaTitulo]);


                //Body da tabela
                let arr = [];

                //linha data da apreensão

                let linhaData;

                if (!obj.Apreensao) {
                    linhaData = e('td', { key: Math.random() }, 'Aguardando confirmação');
                } else {
                    linhaData = e('td', { key: Math.random() }, moment(obj.Apreensao).format('DD/MM/YYYY'));
                }


                let linhaEtapa = e('td', { key: Math.random() }, 'Data da Apreensão');
                let linhaContador = e('th', { key: Math.random() }, 1);
                let linhaConteudo = e('tr', { key: Math.random() }, [linhaContador, linhaEtapa, linhaData]);
                arr.push(linhaConteudo)


                //linha data da solicitação

                linhaData = e('td', { key: Math.random() }, moment(obj.DataSolicitacao).format('DD/MM/YYYY'));
                linhaEtapa = e('td', { key: Math.random() }, 'Data da Solicitacao');
                linhaContador = e('th', { key: Math.random() }, 2);
                linhaConteudo = e('tr', { key: Math.random() }, [linhaContador, linhaEtapa, linhaData]);
                arr.push(linhaConteudo)

                //linha data máxima para solicitar

                if (!obj.LimiteSolicitacao) {
                    linhaData = e('td', { key: Math.random() }, 'Aguardando confirmação');
                } else {
                    linhaData = e('td', { key: Math.random() }, moment(obj.LimiteSolicitacao).format('DD/MM/YYYY'));
                }



                linhaEtapa = e('td', { key: Math.random() }, 'Limite para Solicitar');
                linhaContador = e('th', { key: Math.random() }, 3);
                linhaConteudo = e('tr', { key: Math.random() }, [linhaContador, linhaEtapa, linhaData]);
                arr.push(linhaConteudo)

                //linha data máxima para resposta
                linhaData = e('td', { key: Math.random() }, obj.limitedogerente);
                linhaEtapa = e('td', { key: Math.random() }, 'Limite para Resposta');
                linhaContador = e('th', { key: Math.random() }, 4);
                linhaConteudo = e('tr', { key: Math.random() }, [linhaContador, linhaEtapa, linhaData]);
                arr.push(linhaConteudo)



                const tbody = e('tbody', { key: Math.random() }, arr);
                const table = e('table', { key: Math.random(), className: 'table table-bordered table-info' }, [thead, tbody]);


                return e('div', { key: Math.random() }, [divTituloSolicitar, table]);
            }
        }

        const domContainer = document.querySelector('#conteudo-solicitacao');
        ReactDOM.render(e(Prazos), domContainer);

    }


    getTodos();

}


//Quando o botão de consultar da lista e do card
//são precionados eles já chamam essa função e já
//criam a variavel de sessão idsolicitacao do0 lado do servidor 
const PegarIDSolicitacao = (codigosolicitacao) => {
    axios
        .get("http://127.0.0.1:8049/webrunstudio/ZServicoPegarIDSolicitacao.rule?sys=CCU&IDSOLICITACAO=" + codigosolicitacao)
        .then(response => { })
        .catch(error => console.log(error));
}

const carregaTelaTaxa = () => {

    class Taxa extends React.Component {
        constructor(props) {
            super(props);
            this.state = { value: '' }

            this.handleChange = this.handleChange.bind(this);

        }

        componentDidMount() {
            $('#button-taxa-main').click(() => {
                $("#button-taxa").trigger('click');
            });
        }


        handleChange(event) {
            this.setState({ value: event.target.value });
        }

        render() {
            let avisos = {
                1: 'O agendamento da retirada será realizada por meio de agendamento a ser realizado ás segundas, quartas e sextas, das 9 às 16 horas.',
                2: 'O agendamento da taxa só poderá ser efetuado após a confirmação do pagamento.',
                3: 'A taxa será cobrada a contar do dia da apreensão do bem, até o dia do deferimento do pedido, ou seja, o dia em que for autorizada a retirada.',
                4: 'Caso, por algum motivo, não seja possível comparecer no dia da retirada, deverá ser reimpressa uma nova taxa e será cobrado todo o período a contar da data da apreensão até a data da realização do novo agendamento.'
            }


            let textoecabecalhotaxa = e('span', { key: Math.random() }, 'TAXA DE DEPÓSITO');
            let cabecalhotaxa = e('div', { key: Math.random(), className: 'lableSolicitacoes' }, textoecabecalhotaxa);
            let textoaviso1 = e('span', { key: Math.random() }, avisos['1']);
            let aviso1 = e('div', { key: Math.random(), className: 'avisotaxa' }, textoaviso1);
            let textoaviso2 = e('span', { key: Math.random() }, avisos['2']);
            let aviso2 = e('div', { key: Math.random(), className: 'avisotaxa' }, textoaviso2);
            let textoaviso3 = e('span', { key: Math.random() }, avisos['3']);
            let aviso3 = e('div', { key: Math.random(), className: 'avisotaxa' }, textoaviso3);
            let textoaviso4 = e('span', { key: Math.random() }, avisos['4']);
            let aviso4 = e('div', { key: Math.random(), className: 'avisotaxa' }, textoaviso4);
            let botaotaxa = e('button', { key: Math.random, id: 'button-taxa-main', className: 'btn btn-light btn-lg btn-block' }, 'Imprimir Taxa');
            let divbotaotaxa = e('div', { key: Math.random(), className: 'botaotaxa' }, botaotaxa);
            let botaomarcar = e('button', { key: Math.random, className: 'btn btn-light btn-lg btn-block' }, 'Marcar Entrega');
            let divbotaomarcar = e('div', { key: Math.random(), className: 'botaotaxa' }, botaomarcar);
            let avisopagamento = e('span', { key: Math.random() }, 'AGUARDADO CONFRMAÇÃO DE PAGAMENTO');
            let divconfirmacao = e('div', { key: Math.random(), className: 'confirmacaodepagamento' }, avisopagamento);


            return e('div', { key: Math.random() }, [
                cabecalhotaxa,
                aviso1,
                aviso2,
                aviso3,
                aviso4,
                divbotaotaxa,
                divbotaomarcar,
                divconfirmacao
            ]);
        }
    }

    const domContainer = document.querySelector('#conteudo-solicitacao');
    ReactDOM.render(e(Taxa), domContainer);


    return codigosolicitacao;
}

const excluirImagem = (nome, idsolicitacao) => {
    c(nome + ' - ' + idsolicitacao);
}



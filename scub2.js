'use strict';

const e = React.createElement;
const c = console.log;
var arraydivs = [];

const logado = {
    cpf: '07658259705',
    nome: 'Nieraldo da Silva Lima'
}


var obSol = {
    cpf: '',
    nome: '',
    idauto: '',
    descricao: ''
}



var buscarSolicitacoes = () => {
    class Card extends React.Component {
        constructor(props) {
            super(props);
            this.state = { value: [], arrDivs: [] }

            this.handleChange = this.handleChange.bind(this);

        }

        componentDidMount() {



            axios
                .get("http://127.0.0.1:8049/webrunstudio/ZServicoBuscarSolicitacoes.rule?sys=CCU&CPF=07658259705")
                .then(response => {
                    this.setState({ value: response.data.dados })
                    let arraydiv = [];
                    this.state.value.forEach(
                        (a, b, d) => {
                            if (b === 0) {
                                a.className = 'slide active'
                            } else {
                                a.className = 'slide'
                            }

                            a.pos = b + 1;
                            a.total = d.length;
                            a.DataSolicitacaoDevolucao = moment(a.DataSolicitacaoDevolucao).format('DD/MM/YYYY')

                            let data = e('div', { key: 'd' + b, className: a.className }, e('h5', { key: 'h5' + b, className: 'title' }, a.DataSolicitacaoDevolucao));
                            this.setState(state => ({
                                arrDivs: state.arrDivs.concat(data)
                            }));
                        }
                    )

                    c(this.state.value)

                })
                .catch(error => console.log(error));

        }

        handleChange(event) {
            this.setState({ value: event.target.value });
        }


        render() {
            return e('div', {key: 'slides', className: 'slides'}, [e('div', { key: 'd1', className: 'slide active' }, e('h5', { key: 'h1', className: 'title' }, 'a1')),
            e('div', { key: 'd2', className: 'slide' }, e('h5', { key: 'h2', className: 'title' }, 'a2'))]
        }
    }

    const domContainer = document.querySelector('#card');
    ReactDOM.render(e(Card), domContainer);
}


// Área para renderizar o cabeçalho de solicitação
const titulo = e('p', { key: 'titulo' }, 'NOVA SOLICITAÇÃO')
const textoTitulo = e('p', { key: 'textoTitulo' }, 'Uma nova solicitação será avaliada pela Prefeitura em até 7 dias contados da data da apreensão.')
const corpoTextoAviso = e('div', { key: 'corpoTextoAviso' }, [textoTitulo])
const divTitulo = e('div', { key: 'divTitulo', className: 'lableSolicitacoes' }, titulo)

var logar = (nome, cpf) => {

    obSol.cpf = cpf;
    obSol.nome = nome;

    class Logado extends React.Component {
        constructor(props) {
            super(props);
            this.state = { cpf: cpf, nome: nome }

        }

        render() {

            return e('span', { key: 'logad' }, 'Seja bem vindo, ' + this.state.nome + ' - ' + this.state.cpf)
        }
    }

    const domContainer = document.querySelector('#logado');
    ReactDOM.render(e(Logado), domContainer);
};



$(document).ready(function () {
    if (window.innerWidth < 575) {
        $('#listas').hide();
        $('#card').show();
    } else {
        $('#listas').show();
        $('#card').hide();
    }


    setTimeout(() => {
        logar(logado.nome, logado.cpf);
        if (window.innerWidth < 575) {
            $('#listas').hide();
            $('#card').show();
        } else {
            $('#listas').show();
            $('#card').hide();
        }
    }, 2000)

});

// Fim




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
                let descricao = obSol.descricao;

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
                    axios
                        .get("http://127.0.0.1:8049/webrunstudio/ZServicoBuscarLacre.rule?sys=CCU&LACRE=" + this.state.lacre + "&DATA=" + this.state.data)
                        .then(response => {
                            if (response.data.status === 'error') {
                                alert('Lacre não encontrado. Aguarde 24 horas e tente novamente')
                                $('#divRespostaLacre').empty();
                            } else {
                                var res = response.data.dados[0];
                                obSol.idauto = res.IDAuto;
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

                        let resposta = 'Descrição: ' + this.state.descricao.concat(' Data: ' + this.state.data + ' Local: ' + this.state.local);
                        c(resposta);

                        axios
                            .get("http://127.0.0.1:8049/webrunstudio/ZServicoInserirSolicitacaoDescricao.rule?sys=CCU&CPF=" + obSol.cpf + "&NOME=" + obSol.nome + "&DESCRICAO=" + resposta)
                            .then(response => {

                                sucesso();
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
                ])
        }
    }

    const domContainer = document.querySelector('#conteudo-solicitacao');
    ReactDOM.render(e(Sucesso), domContainer);

}




class ShowWindowDimensions extends React.Component {
    state = { width: 0, height: 0 };
    render() {
        return e('span', {}, null)
    }
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
    };
    componentDidMount() {
        window.addEventListener('resize', this.updateDimensions);
    }
    componentWillUnmount() {
        window.removeEventListener('resize', this.updateDimensions);
    }
}

const domContainer = document.querySelector('#conteudo-solicitacao');
ReactDOM.render(e(ShowWindowDimensions), domContainer);

'use strict';

const e = React.createElement;
const c = console.log;

// Área para renderizar o cabeçalho de solicitação
const titulo = e('p', { key: 'titulo' }, 'NOVA SOLICITAÇÃO')
const textoTitulo = e('p', { key: 'textoTitulo' }, 'Uma nova solicitação será avaliada pela Prefeitura em até 7 dias contados da data da apreensão.')
const corpoTextoAviso = e('div', { key: 'corpoTextoAviso' }, [textoTitulo])
const divTitulo = e('div', { key: 'divTitulo', className: 'lableSolicitacoes' }, titulo)
// Fim

var resLacre = (NumeroAuto, DataApreensao, Logradouro) => {
    class RespostaLacre extends React.Component {
        constructor(props) {
            super(props);
            this.state = { NumeroAuto: NumeroAuto, DataApreensao: moment(DataApreensao).format('DD/MM/YYYY'), Logradouro: Logradouro }

        }

        handleChange(event) {
            this.setState({ value: event.target.value });
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
                    e('button', {key: 'btnEnviarSolicitacao', className: 'btn btn-info btn-lg btn-block', id: 'btnEnviarSolicitacao'}, 'ENVIAR SOLICITAÇÃO')

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
            this.state = { lacre: '', data: '' }

            this.handleChangeLacre = this.handleChangeLacre.bind(this);
            this.handleChangeData = this.handleChangeData.bind(this);
        }

        componentDidMount() {
            $('#button-lacre').click(() => {
                if (!this.state.data) {
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

                                resLacre(res.NumeroAuto, res.DataApreensao, res.Logradouro);
                            }
                        })
                        .catch(error => console.log(error));
                }
                const data = moment('2020-07-03 00:00:00.0').format('DD/MM/YYYY')
            })
        }

        handleChangeLacre(event) {
            this.setState({ lacre: event.target.value });
        }

        handleChangeData(event) {
            this.setState({ data: event.target.value });
        }



        render() {
            return e('div', { className: 'divPrincipalSolicitacoes' }, [
                divTitulo,
                textoTitulo,
                e('div', { key: 'divData', className: 'form-group' },
                    [
                        e('label', { key: 'labelData' }, 'Data da Apreensão'),
                        e('input', { key: 'inputData', value: this.state.data, onChange: this.handleChangeData, type: 'date', min: '2020-01-01', id: 'datepicker', className: 'form-control' }, null)
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
            this.state = { value: '' }

            this.handleChange = this.handleChange.bind(this);

        }

        handleChange(event) {
            this.setState({ value: event.target.value });
        }



        render() {

            return e('div', { key: 'divPrincipalDescricao', className: 'divPrincipalSolicitacoes' },
                [
                    divTitulo,
                    textoTitulo,
                    e('div', { key: 'divBuscaDescricao', className: 'input-group mb-3' },
                        [
                            e('textarea', { key: 'textareaDescricao', value: this.state.value, onChange: this.handleChange, className: 'form-control', placeholder: 'Informe uma breve descrição da mercadoria', 'aria-label': 'Informe uma breve descrição da mercadoria', 'aria-describedby': 'button-addon2' }, null),
                            e('div', { key: 'divTituloButtonbuttonDescricao', className: 'input-group-append' }, e('button', { key: 'buttonDescricao', className: 'btn btn-outline-secondary', type: 'button', id: 'button-lacre', onClick: () => teste(this.state.value) }, 'Informar'))
                        ])
                ]);
        }
    }

    const domContainer = document.querySelector('#conteudo-solicitacao');
    ReactDOM.render(e(Descricao), domContainer);
}

const teste = (lacre, data) => {
    alert(lacre + ' - ' + data);
}








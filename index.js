//Imports
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const connection = require('./database/database');
const pergunta = require('./database/Pergunta');
const Resposta = require('./database/Resposta');

//Database
connection.authenticate().then(() => {
    console.log('Conexão estabelecida com banco')
}).catch((msgErro) => {
    console.log(msgErro)
});

//Definindo para o Express usar o ejs
app.set('view engine', 'ejs');

//Definindo o uso de arquivos estaticos
app.use(express.static('public'));

//Decodifica os dados enviados
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json()); //Body-parser aceitar json

//Home
app.get('/', (req, res) => {
    pergunta.findAll({
        raw: true,
        order: [ //Ordenando por id decrescentemente
            ['id', 'DESC'] // ASC = crescente || DESC = decrescente
        ]
    }).then(perguntas => { //pesquisa e salva em 'perguntas'
        res.render('index', { // renderiza a pagina index e envia ao front os dados
            perguntas
        });
    });
});

// Cadastrar pergunta
app.get('/perguntar', (req, res) => {
    res.render('perguntar');
});

app.post('/salvarpergunta', (req, res) => {
    var titulo = req.body.titulo;
    var descricao = req.body.descricao;
    pergunta.create({
        titulo,
        descricao
    }).then(() => {
        res.redirect('/'); //Apos salvar, redireciona para '/'
    });
});

//Exibe Pergunta
app.get('/pergunta/:id', (req, res) => {
    var id = req.params.id;
    pergunta.findOne({ //pesquisa no banco
        where: {
            id: id
        }
        //Then executa algo apos uma acao
    }).then(pergunta => {
        if (pergunta != undefined) {
            Resposta.findAll({
                where: {
                    perguntaId: pergunta.id
                },
                order: [
                    ['id', 'DESC']
                ]
            }).then(respostas => {
                //enviando os dados ao front
                res.render('pergunta', {
                    pergunta,
                    respostas
                });
            });

            //pergunta nao encontrada
        } else {
            res.render('404');
        }
    });
});

app.post('/responder', (req, res) => {
    var corpo = req.body.corpo;
    var perguntaId = req.body.pergunta;

    Resposta.create({
        corpo,
        perguntaId
    }).then(() => {
        res.redirect('/pergunta/' + perguntaId)
    });

});


//Servidor
app.listen(3333, () => {
    console.log('Servidor funcionando na porta 3333');
});
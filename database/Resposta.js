const sequelize = require('sequelize');
const connection = require('./database');

//Criando Tabela com Sequelize
const Resposta = connection.define('respostas', {
    corpo: {
        type: sequelize.TEXT,
        allowNull: false
    },
    perguntaId: {
        type: sequelize.INTEGER,
        allowNull: false
    }
});

Resposta.sync({
    force: false
}).then(() => {
    console.log('table RESPOSTA has been created');
});

module.exports = Resposta;
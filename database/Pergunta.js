const sequelize = require('sequelize');
const connection = require('./database');

//Criando Tabela com Sequelize
const pergunta = connection.define('perguntas', {
    titulo: {
        type: sequelize.STRING,
        allowNull: false
    },
    descricao: {
        type: sequelize.TEXT,
        allowNull: false
    }
});

pergunta.sync({
    force: false
}).then(() => {
    console.log('table PERGUNTA has been created');
});

module.exports = pergunta;
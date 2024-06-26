const express = require("express");
const exphbs = require("express-handlebars");
const mysql2 = require("mysql2");

// Express
const app = express();

// Configuração do middleware para verificar solicitações com o tipo de conteúdo body
app.use(
    express.urlencoded({
        extended: true
    })
)

// Configura o Middleware (Funções que trazem requisições e respostas) para analisar solicitações com o tipo de conteúdo
app.use(express.json());

// Configurações do Handlebars
app.engine("handlebars", exphbs.engine())
app.set("view engine", "handlebars");

// Primeira rota
app.get("/", (req, res) => {
    /* res.send("Boa, chefia"); */
    res.render("home");
});

// Listando produtos da Lista
app.get("/lista", (req, res) => {
    const sql = "SELECT * FROM Produtos";

    // Função de conexão com MYSQL
    conn.query(sql, function(err, data) {
        if(err) {
            console.log(err);
            return;
        }

        const lista = data;
        res.render("listas", {lista});
    })
});

//Cadastrando
app.post("/lista/insertProdutos", (req, res) => {
    const produto = req.body.Produto;
    const preco = req.body.Preco;
    const descricao = req.body.Descricao;

    // Query do SQL para cadastrar
    const sql = `INSERT INTO Produtos(Produto, Preco, Descricao) VALUES ('${produto}', '${preco}', '${descricao}')`

    conn.query(sql, function (err) {
        if (err) {
            console.log("Erro ", err);
            return false;
        }

        res.redirect("/lista");
    })
})

// Listando e buscando por ID
app.get('/lista/:id', (req, res) => {
    const id = req.params.id;
    const sql = `SELECT * FROM Produtos WHERE id = ${id}`;

    conn.query(sql, function(err, data) {
        if (err) {
            console.log(err);
        }

        const  detalhes = data[0];

        res.render('detalhes', {detalhes})
    })

});

// Removendo Item
app.post('/lista/remove/:id', (req, res) => {
    const id = req.params.id;
    const sql = `DELETE from Produtos WHERE iD = ${id}`;

    conn.query(sql, function(err) {
        if (err) {
            console.log(err);
        }

        res.redirect('/lista');
    });
});

// Página de edição por ID
app.get('/detalhes/edit/:id', (req, res) => {

    const id = req.params.id;

    const sql = `SELECT * FROM Produtos WHERE iD = ${id}`;

    conn.query(sql, function(err, data) {
        if (err) {
            console.log(err);
            return;
        }

        const listaDetalhes = data[0];

        res.render('editdetalhes', { listaDetalhes });
    });

});

// Edição a update
app.post('/detalhes/updatelista', (req, res) => {
    const id = req.body.iD;
    const produto = req.body.Produto;
    const preco = req.body.Preco;
    const descricao = req.body.Descricao;

    const sql = `UPDATE Produtos set Produto = '${produto}', Preco = '${preco}', Descricao = '${descricao}' WHERE iD = '${id}'`;

    conn.query(sql, function (err) {
        if (err) {
            console.log(err);
            return;
        }

        res.redirect('/lista')
    })
})

// Conexão com banco de dados
const conn = mysql2.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "Mercado"
});

// Configuração do banco
conn.connect(function (err) {
    if (err) {
        console.log(err);
    }

    // Porta e executando o projeto 
    console.log("Conectado ao Banco de dados MYSQL")
    app.listen(5000);
});
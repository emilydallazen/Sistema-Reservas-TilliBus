const express = require('express');

const pgp = require("pg-promise")({});

/*const usuario = "postgres";
const senha = "postgres";
const host = "localhost";
const porta = "5432";
const banco_de_dados = "ProgII";

const db_pg = pgp(`postgres://${usuario}:${senha}@${host}:${porta}/${banco_de_dados}`);*/

const app = express();

//app.use(express.json());

app.listen(3001, () => console.log("Servidor rodando na porta 3001"));

app.get("/api", (req, res) => {
    res.send("Backend OK!");
})


//Exemplo atividade de PROG II
/*
app.get("/cursos", async function (req, res) {
    let cursos = await db_pg.any("SELECT * FROM cursos;");
    res.status(200).send(cursos);
});

app.get("/cursos/:id", async function (req, res) {
    const id = parseInt(req.params.id);
    let curso = await db_pg.one("SELECT * FROM cursos WHERE ID = $1;", id).then(()=>{
        res.status(200).send(curso);
    }).catch(error => {
        res.status(500).send("Erro ao consultar curso: " + error.message);    
    });
    
});

app.post("/cursos", function (req, res) {
    db_pg.none("INSERT INTO cursos (id, nome, descricao) VALUES ($1, $2, $3);", [req.body.id, req.body.nome, req.body.descricao]).then(()=>{
        res.status(200).send("Curso inserido!");
    }).catch(error => {
        res.status(500).send("Erro ao inserir curso: " + error.message); 
    });
    
});

app.delete("/cursos/:id", function (req, res) {
    const id = parseInt(req.params.id);
    db_pg.result("DELETE FROM cursos where ID = $1;", id).then(result => {
        if(result.rowCount > 0)
            res.status(200).send("Curso excluido!");
        else
            res.status(404).send("Curso não encontrado!"); 
    }).catch(error => {
        res.status(500).send("Erro ao excluir curso: " + error.message);    
    })
    
});

app.put("/cursos/:id", function (req, res) {
    const id = parseInt(req.params.id);
    db_pg.result("UPDATE cursos SET id = $1, nome = $2, descricao = $3 where ID = $4;", [req.body.id, req.body.nome, req.body.descricao, id]).then(result => {
        if(result.rowCount > 0)
            res.status(200).send("Curso atualizado!");
        else
            res.status(404).send("Curso não encontrado!"); 
    }).catch(error => {
        res.status(500).send("Erro ao alterar curso: " + error.message);    
    })
    
});*/
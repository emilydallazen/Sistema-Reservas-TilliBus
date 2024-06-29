const express = require('express');

const pgp = require("pg-promise")({});

const db = require('./database');

/*const usuario = "postgres";
const senha = "postgres";
const host = "localhost";
const porta = "5432";
const banco_de_dados = "ProgII";

const db_pg = pgp(`postgres://${usuario}:${senha}@${host}:${porta}/${banco_de_dados}`);*/

const app = express();

app.use(express.json());

app.listen(3001, () => console.log("Servidor rodando na porta 3001"));

app.get("/api", (req, res) => {
    res.send("Backend OK!");
})


//CRUD USUÁRIO
app.get("/usuarios", function (req, res) {
    res.send(db.usuario);
});

app.get("/usuarios/:id", function (req, res) {
    const id = parseInt(req.params.id);
    const indexusuario = db.usuario.findIndex(usuario => usuario.id === id);
    if(indexusuario !== -1){
        res.send(db.usuario[indexusuario]);
    } else {
        res.status(404).send("Usuario não encontrado");
    }
});

app.post("/usuarios", function (req, res) {
    db.usuario.push(req.body);
    res.send(db.usuario);
});

app.delete("/usuarios/:id", function (req, res) {
    const id = parseInt(req.params.id);
    const indexusuario = db.usuario.findIndex(usuario => usuario.id === id);
    if(indexusuario !== -1){
        db.usuario.splice(indexusuario, 1);
        res.send(db.usuario);
    } else {
        res.status(404).send("Usuario não encontrado");
    }
});

app.put("/usuarios/:id", function (req, res) {
    const id = parseInt(req.params.id);
    const indexusuario = db.usuario.findIndex(usuario => usuario.id === id);
    if(indexusuario !== -1){
        db.usuario[indexusuario] = req.body;
        res.send(db.usuario[indexusuario]);
    } else {
        res.status(404).send("Usuario não encontrado");
    }
});


//CRUD CLIENTE
app.get("/clientes", function (req, res) {
    res.send(db.cliente);
});

app.get("/clientes/:id", function (req, res) {
    const id = parseInt(req.params.id);
    const indexcliente = db.cliente.findIndex(cliente => cliente.id === id);
    if(indexcliente !== -1){
        res.send(db.cliente[indexcliente]);
    } else {
        res.status(404).send("Cliente não encontrado");
    }
});

app.post("/clientes", function (req, res) {
    db.cliente.push(req.body);
    res.send(db.cliente);
});

app.delete("/clientes/:id", function (req, res) {
    const id = parseInt(req.params.id);
    const indexcliente = db.cliente.findIndex(cliente => cliente.id === id);
    if(indexcliente !== -1){
        db.cliente.splice(indexcliente, 1);
        res.send(db.cliente);
    } else {
        res.status(404).send("Cliente não encontrado");
    }
});

app.put("/clientes/:id", function (req, res) {
    const id = parseInt(req.params.id);
    const indexcliente = db.cliente.findIndex(cliente => cliente.id === id);
    if(indexcliente !== -1){
        db.cliente[indexcliente] = req.body;
        res.send(db.cliente[indexcliente]);
    } else {
        res.status(404).send("Cliente não encontrado");
    }
});


//CRUD RESERVA
app.get("/reservas", function (req, res) {
    res.send(db.reserva);
});

app.get("/reservas/:id", function (req, res) {
    const id = parseInt(req.params.id);
    const indexreserva = db.reserva.findIndex(reserva => reserva.id === id);
    if(indexreserva !== -1){
        res.send(db.reserva[indexreserva]);
    } else {
        res.status(404).send("Reserva não encontrada");
    }
});

app.post("/reservas", function (req, res) {
    db.reserva.push(req.body);
    res.send(db.reserva);
});

app.delete("/reservas/:id", function (req, res) {
    const id = parseInt(req.params.id);
    const indexreserva = db.reserva.findIndex(reserva => reserva.id === id);
    if(indexreserva !== -1){
        db.reserva.splice(indexreserva, 1);
        res.send(db.reserva);
    } else {
        res.status(404).send("Reserva não encontrada");
    }
});

app.put("/reservas/:id", function (req, res) {
    const id = parseInt(req.params.id);
    const indexreserva = db.reserva.findIndex(reserva => reserva.id === id);
    if(indexreserva !== -1){
        db.reserva[indexreserva] = req.body;
        res.send(db.reserva[indexreserva]);
    } else {
        res.status(404).send("Reserva não encontrada");
    }
});

//CRUD BLOQUEIO
app.get("/bloqueios", function (req, res) {
    res.send(db.bloqueio);
});

app.get("/bloqueios/:id", function (req, res) {
    const id = parseInt(req.params.id);
    const indexbloqueio = db.bloqueio.findIndex(bloqueio => bloqueio.id === id);
    if(indexbloqueio !== -1){
        res.send(db.bloqueio[indexbloqueio]);
    } else {
        res.status(404).send("Bloqueio não encontrado");
    }
});

app.post("/bloqueios", function (req, res) {
    db.bloqueio.push(req.body);
    res.send(db.bloqueio);
});

app.delete("/bloqueios/:id", function (req, res) {
    const id = parseInt(req.params.id);
    const indexbloqueio = db.bloqueio.findIndex(bloqueio => bloqueio.id === id);
    if(indexbloqueio !== -1){
        db.bloqueio.splice(indexbloqueio, 1);
        res.send(db.bloqueio);
    } else {
        res.status(404).send("Bloqueio não encontrado");
    }
});

app.put("/bloqueios/:id", function (req, res) {
    const id = parseInt(req.params.id);
    const indexbloqueio = db.bloqueio.findIndex(bloqueio => bloqueio.id === id);
    if(indexbloqueio !== -1){
        db.bloqueio[indexbloqueio] = req.body;
        res.send(db.bloqueio[indexbloqueio]);
    } else {
        res.status(404).send("Bloqueio não encontrado");
    }
});


//Exemplo atividade de PROG II
/*
//CRUD Curso
app.get("/cursos", function (req, res) {
    res.send(db.cursos);
});

app.get("/cursos/:id", function (req, res) {
    const id = parseInt(req.params.id);
    const indexcurso = db.cursos.findIndex(curso => curso.id === id);
    res.send(db.cursos[indexcurso]);
});

app.post("/cursos", function (req, res) {
    db.cursos.push(req.body);
    res.send(db.cursos);
});

app.delete("/cursos/:id", function (req, res) {
    const id = parseInt(req.params.id);
    const indexcurso = db.cursos.findIndex(curso => curso.id === id);
    if(indexcurso !== -1){
        db.cursos.splice(indexcurso, 1);
        res.send(db.cursos);
    } else {
        res.status(404).send("Curso não encontrado");
    }
});

app.put("/cursos/:id", function (req, res) {
    const id = parseInt(req.params.id);
    const indexcurso = db.cursos.findIndex(curso => curso.id === id);
    if(indexcurso !== -1){
        db.cursos[indexcurso] = req.body;
        res.send(db.cursos[indexcurso]);
    } else {
        res.status(404).send("Curso não encontrado");
    }
});


//CRUD CCR
app.get("/ccrs", function (req, res) {
    res.send(db.ccrs);
});

app.get("/ccrs/:id", function (req, res) {
    const id = req.params.id;
    const indexccr = db.ccrs.findIndex(ccr => ccr.id === id);
    res.send(db.ccrs[indexccr]);
});

app.post("/ccrs", function (req, res) {
    db.ccrs.push(req.body);
    res.send(db.ccrs);
});

app.delete("/ccrs/:id", function (req, res) {
    const id = req.params.id;
    const indexccr = db.ccrs.findIndex(ccr => ccr.id === id);
    if(indexccr !== -1){
        db.ccrs.splice(indexccr, 1);
        res.send(db.ccrs);
    } else {
        res.status(404).send("CCR não encontrado");
    }
});

app.put("/ccrs/:id", function (req, res) {
    const id = parseInt(req.params.id);
    const indexccr = db.ccrs.findIndex(ccr => ccr.id === id);
    if(indexccr !== -1){
        db.ccrs[indexccr] = req.body;
        res.send(db.ccrs[indexccr]);
    } else {
        res.status(404).send("CCR não encontrado");
    }
});*/
const express = require('express');

//const pgp = require("pg-promise")({});

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
    //Validar se não existe outro usuário com o mesmo nome
    const userName = req.nome;
    const indexuser = db.usuario.findindex(usuario => usuario.nome === userName);
    if(indexuser !== -1){
        res.status(500).send("Já existe um usuário com esse nome.");
    } else{
        db.usuario.push(req.body);
        res.send(db.usuario);
    }
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
    //Validar se não existe outro com o mesmo cpf
    const clienteCpf = req.nome;
    const indexcliente = db.cliente.findindex(cliente => cliente.cpf === clienteCpf);
    if(indexcliente !== -1){
        res.status(500).send("Já existe um cliente com esse cpf.");
    } else{
        db.cliente.push(req.body);
        res.send(db.cliente);
    }
});

app.delete("/clientes/:id", function (req, res) {
    //Validar se o cliente não tem reservas pendentes antes de deletar
    const id = parseInt(req.params.id);
    const indexreserva = db.reserva.findIndex(reserva => reserva.cliente === id);
    const indexcliente = db.cliente.findIndex(cliente => cliente.id === id);
    if(indexcliente !== -1 && indexreserva === -1){
        db.cliente.splice(indexcliente, 1);
        res.send(db.cliente);
    } else if(indexreserva !== -1) {
        res.status(500).send("Existem reservas associadas a esse cliente, portanto não é possivel excluí-lo.");
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
    const indexhospedagem = db.hospedagem.findIndex(hospedagem => hospedagem.id === parseInt(req.hospedagem));
    const indexcliente = db.cliente.findIndex(cliente => cliente.id === parseInt(req.cliente));
    const indexbloqueio = db.bloqueio.findIndex(bloqueio => bloqueio.data_inicial <= req.checkout && bloqueio.data_final >= req.checkin);
    if(indexhospedagem === -1){    //Validar se a hospedagem informada existe
        res.status(500).send("A hospedagem informada não existe.");
    }else if(indexcliente === -1){    //validar se o cliente existe
        res.status(500).send("O cliente informado não existe.");
    }else if(indexbloqueio !== -1){    //Validar ao cadastrar ou alterar se não existe bloqueio de agenda
        res.status(500).send("Existe um bloqueio de agenda para o período selecionado, verifique!");
    }else if(parseInt(req.qtde_adultos) > parseInt(db.hospedagem[indexhospedagem].lim_hospedes)){    //Valdar se a quantia de adultos é <= ao limite da hospedagem
        res.status(500).send("A quantia de adultos informada supera o limite de hóspedes para a hospedagem selecionada.");
    }else if(parseInt(req.qtde_diarias) <= 0){    //Validar quantidade de diárias > 0
        res.status(500).send("Informe a quantia de diárias.");
    }else{
        db.reserva.push(req.body);
        res.send(db.reserva);
    }
});

app.delete("/reservas/:id", function (req, res) {
    //Ao deletar, deletar também os adicionais e pagamento
    const id = parseInt(req.params.id);
    const indexreserva = db.reserva.findIndex(reserva => reserva.id === id);
    if(indexreserva !== -1){
        //Excluir pagamento
        db.pagamento_reserva = db.pagamento_reserva.filter(pagamento => pagamento.reserva !== id);

        //Excluir adicionais
        db.reserva_servico = db.reserva_servico.filter(servico => servico.reserva !== id);
        
        //Excluir reserva
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
//Ao cadastrar ou alterar, validar se não existe alguma reserva já cadastrada para o período

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
    const indexreserva = db.reserva.findIndex(reserva => reserva.checkin <= req.data_final && reserva.checkout >= req.data_inicial);
    if(indexreserva !== -1){
        res.status(500).send("Já existem reservas para esse período.")
    }else{
        db.bloqueio.push(req.body);
        res.send(db.bloqueio);
    }
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
    const indexreserva = db.reserva.findIndex(reserva => reserva.checkin <= req.data_final && reserva.checkout >= req.data_inicial);
    const indexbloqueio = db.bloqueio.findIndex(bloqueio => bloqueio.id === id);
    if(indexreserva !== -1){
        res.status(500).send("Já existem reservas para esse período.")
    }else if(indexbloqueio !== -1){
        db.bloqueio[indexbloqueio] = req.body;
        res.send(db.bloqueio[indexbloqueio]);
    } else {
        res.status(404).send("Bloqueio não encontrado");
    }
});

//CRUD DESPESA
app.get("/despesas", function (req, res) {
    res.send(db.despesa);
});

app.get("/despesas/:id", function (req, res) {
    const id = parseInt(req.params.id);
    const indexbdespesa = db.despesa.findIndex(despesa => despesa.id === id);
    if(indexbdespesa !== -1){
        res.send(db.despesa[indexbdespesa]);
    } else {
        res.status(404).send("Despesa não encontrada");
    }
});

app.post("/despesas", function (req, res) {
    db.despesa.push(req.body);
    res.send(db.despesa);
});

app.delete("/despesas/:id", function (req, res) {
    const id = parseInt(req.params.id);
    const indexbdespesa = db.despesa.findIndex(despesa => despesa.id === id);
    if(indexbdespesa !== -1){
        db.despesa.splice(indexbdespesa, 1);
        res.send(db.despesa);
    } else {
        res.status(404).send("Despesa não encontrada");
    }
});

app.put("/despesas/:id", function (req, res) {
    const id = parseInt(req.params.id);
    const indexbdespesa = db.despesa.findIndex(despesa => despesa.id === id);
    if(indexbdespesa !== -1){
        db.despesa[indexbdespesa] = req.body;
        res.send(db.despesa[indexbdespesa]);
    } else {
        res.status(404).send("Despesa não encontrada");
    }
});

//CRUD CATEGORIA_DESPESA
app.get("/catdes", function (req, res) {
    res.send(db.categoria_despesa);
});

app.get("/catdes/:id", function (req, res) {
    const id = parseInt(req.params.id);
    const indexcatdespesa = db.categoria_despesa.findIndex(categoria_despesa => categoria_despesa.id === id);
    if(indexcatdespesa !== -1){
        res.send(db.categoria_despesa[indexcatdespesa]);
    } else {
        res.status(404).send("Categoria de despesa não encontrada");
    }
});

app.post("/catdes", function (req, res) {
    db.categoria_despesa.push(req.body);
    res.send(db.categoria_despesa);
});

app.delete("/catdes/:id", function (req, res) {
    const id = parseInt(req.params.id);
    const indexcatdespesa = db.categoria_despesa.findIndex(categoria_despesa => categoria_despesa.id === id);
    if(indexcatdespesa !== -1){
        db.categoria_despesa.splice(indexcatdespesa, 1);
        res.send(db.categoria_despesa);
    } else {
        res.status(404).send("Categoria de despesa não encontrada");
    }
});

app.put("/catdes/:id", function (req, res) {
    const id = parseInt(req.params.id);
    const indexcatdespesa = db.categoria_despesa.findIndex(categoria_despesa => categoria_despesa.id === id);
    if(indexcatdespesa !== -1){
        db.categoria_despesa[indexcatdespesa] = req.body;
        res.send(db.categoria_despesa[indexcatdespesa]);
    } else {
        res.status(404).send("Categoria de despesa não encontrada");
    }
});

//CRUD PAGAMENTO_RESERVA
app.get("/pagamentos", function (req, res) {
    res.send(db.pagamento_reserva);
});

app.get("/pagamentos/:id", function (req, res) {
    const id = parseInt(req.params.id);
    const indexpagamento = db.pagamento_reserva.findIndex(pagamento_reserva => pagamento_reserva.id === id);
    if(indexpagamento !== -1){
        res.send(db.pagamento_reserva[indexpagamento]);
    } else {
        res.status(404).send("Pagamento não encontrado");
    }
});

app.post("/pagamentos", function (req, res) {
    // Valida se já existe um registro de pagamento não parcelado para essa reserva
    const indexpagamento = db.pagamento_reserva.findIndex(pagamento => pagamento.reserva === parseInt(req.reserva) && pagamento.parcelado === false);
    if(indexpagamento !== -1){
        res.status(500).send("A reserva já foi paga.");
    }else{
        db.pagamento_reserva.push(req.body);
        res.send(db.pagamento_reserva);
    }
});

app.delete("/pagamentos/:id", function (req, res) {
    const id = parseInt(req.params.id);
    const indexpagamento = db.pagamento_reserva.findIndex(pagamento_reserva => pagamento_reserva.id === id);
    if(indexpagamento !== -1){
        db.pagamento_reserva.splice(indexpagamento, 1);
        res.send(db.pagamento_reserva);
    } else {
        res.status(404).send("Pagamento não encontrado");
    }
});

app.put("/pagamentos/:id", function (req, res) {
    const id = parseInt(req.params.id);
    const indexpagamento = db.pagamento_reserva.findIndex(pagamento_reserva => pagamento_reserva.id === id);
    if(indexpagamento !== -1){
        db.pagamento_reserva[indexpagamento] = req.body;
        res.send(db.pagamento_reserva[indexpagamento]);
    } else {
        res.status(404).send("Pagamento não encontrado");
    }
});

//CRUD SERVICO_ADICIONAL
app.get("/servicos", function (req, res) {
    res.send(db.servico_adicional);
});

app.get("/servicos/:id", function (req, res) {
    const id = parseInt(req.params.id);
    const indexservico = db.servico_adicional.findIndex(servico_adicional => servico_adicional.id === id);
    if(indexservico !== -1){
        res.send(db.servico_adicional[indexservico]);
    } else {
        res.status(404).send("Serviço não encontrado");
    }
});

app.post("/servicos", function (req, res) {
    db.servico_adicional.push(req.body);
    res.send(db.servico_adicional);
});

app.delete("/servicos/:id", function (req, res) {
    //Ao deletar, bloquear caso já tenha sido usado
    const id = parseInt(req.params.id);
    const indexuso = db.reserva_servico.findIndex(uso => uso.servico === id);
    const indexservico = db.servico_adicional.findIndex(servico_adicional => servico_adicional.id === id);
    if(indexuso !== -1){
        res.status(500).send("O serviço já foi utilizado, portanto não é possível deletar.")
    }else if(indexservico !== -1){
        db.servico_adicional.splice(indexservico, 1);
        res.send(db.servico_adicional);
    } else {
        res.status(404).send("Serviço não encontrado");
    }
});

app.put("/servicos/:id", function (req, res) {
    const id = parseInt(req.params.id);
    const indexservico = db.servico_adicional.findIndex(servico_adicional => servico_adicional.id === id);
    if(indexservico !== -1){
        db.servico_adicional[indexservico] = req.body;
        res.send(db.servico_adicional[indexservico]);
    } else {
        res.status(404).send("Serviço não encontrado");
    }
});

//CRUD SERVICO POR RESERVA
app.get("/servreserva", function (req, res) {
    res.send(db.reserva_servico);
});

app.get("/servreserva/:reserva/:servico", function (req, res) {
    const preserva = parseInt(req.params.reserva);
    const pservico = parseInt(req.params.servico);

    const servicoReserva = db.reserva_servico.find(servico => 
        servico.reserva === preserva && servico.servico === pservico
    );

    if (servicoReserva) {
        res.send(servicoReserva);
    } else {
        res.status(404).send("Serviço não encontrado para a reserva especificada.");
    }
});

app.post("/servreserva", function (req, res) {
    //Validar se o serviço existe
    const indexservico = db.servico_adicional.findIndex(servico => servico.id === parseInt(req.servico))
    if(indexservico === -1){
        res.status(404).send("Serviço não encontrado.");
    }else{
        db.reserva_servico.push(req.body);
        res.send(db.reserva_servico);
    }
});

app.delete("/servreserva/:reserva/:servico", function (req, res) {
    const preserva = parseInt(req.params.reserva);
    const pservico = parseInt(req.params.servico);

    const indexservico = db.reserva_servico.findIndex(servico => 
        servico.reserva === preserva && servico.servico === pservico
    );
    if (indexservico !== -1) {
        db.reserva_servico.splice(indexservico, 1);
        res.send(db.reserva_servico);
    } else {
        res.status(404).send("Serviço não encontrado para a reserva especificada.");
    }
});

app.put("/servreserva/:reserva/:servico", function (req, res) {
    const preserva = parseInt(req.params.reserva);
    const pservico = parseInt(req.params.servico);

    const indexservico = db.reserva_servico.findIndex(servico => 
        servico.reserva === preserva && servico.servico === pservico
    );
    if (indexservico !== -1) {
        db.reserva_servico[indexservico] = req.body;
        res.send(db.reserva_servico[indexservico]);
    } else {
        res.status(404).send("Serviço não encontrado para a reserva especificada.");
    }
});

//CRUD HOSPEDAGEM
app.get("/hospedagem", function (req, res) {
    res.send(db.hospedagem);
});

app.get("/hospedagem/:id", function (req, res) {
    const id = parseInt(req.params.id);
    const indexhospedagem = db.hospedagem.findIndex(hospedagem => hospedagem.id === id);
    if(indexhospedagem !== -1){
        res.send(db.hospedagem[indexhospedagem]);
    } else {
        res.status(404).send("Hospedagem não encontrada.");
    }
});

app.post("/hospedagem", function (req, res) {
    db.hospedagem.push(req.body);
    res.send(db.hospedagem);
});

app.delete("/hospedagem/:id", function (req, res) {
    //Ao deletar, bloquear caso já tenha sido usada
    //Ao deletar, deletar também valores por dia
    const id = parseInt(req.params.id);
    const indexreserva = db.reserva.findIndex(reserva => reserva.hospedagem === id);
    const indexhospedagem = db.hospedagem.findIndex(hospedagem => hospedagem.id === id);
    if(indexreserva !== -1){
        res.status(500).send("Existem reservas associadas à hospedagem, portanto não é possível excluir.");
    }else if(indexhospedagem !== -1){
        //Deletar os valores
        db.valor_hospedagem = db.valor_hospedagem.filter(valor => valor.hospedagem !== id);

        //Deleta a hospedagem
        db.hospedagem.splice(indexhospedagem, 1);
        res.send(db.hospedagem);
    } else {
        res.status(404).send("Hospedagem não encontrada.");
    }
});

app.put("/hospedagem/:id", function (req, res) {
    const id = parseInt(req.params.id);
    const indexhospedagem = db.hospedagem.findIndex(hospedagem => hospedagem.id === id);
    if(indexhospedagem !== -1){
        db.hospedagem[indexhospedagem] = req.body;
        res.send(db.hospedagem[indexhospedagem]);
    } else {
        res.status(404).send("Hospedagem não encontrada.");
    }
});

//CRUD VALOR HOSPEDAGEM
app.get("/valorh", function (req, res) {
    res.send(db.valor_hospedagem);
});

app.get("/valorh/:hospedagem/:dia_semana", function (req, res) {
    const hospedagem = parseInt(req.params.hospedagem);
    const dia_semana = parseInt(req.params.dia_semana);

    const valorHospedagem = db.valor_hospedagem.find(valor => 
        valor.hospedagem === hospedagem && valor.dia_semana === dia_semana
    );

    if (valorHospedagem) {
        res.send(valorHospedagem);
    } else {
        res.status(404).send("Valor não encontrado para a hospedagem e dia da semana especificados.");
    }
});

app.post("/valorh", function (req, res) {
    //Validar chaves (hospedagem, dia)
    const indexhospedagem = db.hospedagem.findIndex(hospedagem => hospedagem.id === parseInt(req.hospedagem));
    const indexchave = db.valor_hospedagem.findIndex(chave => chave.hospedagem === parseInt(req.hospedagem) && chave.dia_semana === parseInt(req.dia_semana));
    if(indexhospedagem === -1){
        res.status(404).send("Hospedagem não encontrada.");
    }else if(indexchave !== -1){
        res.status(500).send("Já existe um valor cadastrado para essa hospedagem e dia.");
    }else{
        db.valor_hospedagem.push(req.body);
        res.send(db.valor_hospedagem);
    }
});

app.delete("/valorh/:hospedagem/:dia_semana", function (req, res) {
    const hospedagem = parseInt(req.params.hospedagem);
    const dia_semana = parseInt(req.params.dia_semana);

    const indexvalor = db.valor_hospedagem.findIndex(valor => 
        valor.hospedagem === hospedagem && valor.dia_semana === dia_semana
    );

    if (indexvalor !== -1) {
        db.valor_hospedagem.splice(indexvalor, 1);
        res.send(db.valor_hospedagem);
    } else {
        res.status(404).send("Valor não encontrado para a hospedagem e dia da semana especificados.");
    }
});

app.put("/valorh/:hospedagem/:dia_semana", function (req, res) {
    const hospedagem = parseInt(req.params.hospedagem);
    const dia_semana = parseInt(req.params.dia_semana);

    const indexvalor = db.valor_hospedagem.findIndex(valor => 
        valor.hospedagem === hospedagem && valor.dia_semana === dia_semana
    );

    if (indexvalor !== -1) {
        db.valor_hospedagem[indexvalor] = req.body;
        res.send(db.valor_hospedagem[indexvalor]);
    } else {
        res.status(404).send("Valor não encontrado para a hospedagem e dia da semana especificados.");
    }
});
const express = require('express');

const pgp = require("pg-promise")({});

const db = require('./database');

const usuario = "postgres";
const senha = "postgres";
const host = "localhost";
const porta = "5432";
const banco_de_dados = "bdtilli";

const db_pg = pgp(`postgres://${usuario}:${senha}@${host}:${porta}/${banco_de_dados}`);

const app = express();

app.use(express.json());

app.listen(3001, () => console.log("Servidor rodando na porta 3001"));

app.get("/api", (req, res) => {
    res.send("Backend OK!");
})


//CRUD USUÁRIO

app.get("/usuarios", async function (req, res) {
    let dbusuarios = await db_pg.any("SELECT * FROM Usuario Where Deleted is NULL;");
    res.status(200).send(dbusuarios);
});

app.get("/usuarios/:id", async function (req, res) {
    const id = parseInt(req.params.id);
    await db_pg.one("SELECT * FROM Usuario WHERE Usu_ID = $1 AND DELETED is NULL;", id).then(dbusuario =>{
        res.status(200).send(dbusuario);
    }).catch(error => {
        res.status(500).send("Erro ao consultar usuário: " + error.message);    
    });
});

app.post("/usuarios", function (req, res) {
    db_pg.none("INSERT INTO Usuario (USU_Nome, USU_Celular, USU_Email, USU_Senha, USU_Administrador, Deleted) \
    VALUES ($1, $2, $3, $4, $5, NULL);", [req.body.usu_nome, req.body.usu_celular, req.body.usu_email, req.body.usu_senha, req.body.usu_administrador]).then(()=>{
        res.status(200).send("Usuário inserido!");
    }).catch(error => {
        res.status(500).send("Erro ao inserir usuário: " + error.message); 
    });
});

app.delete("/usuarios/:id", function (req, res) {
    const id = parseInt(req.params.id);
    db_pg.none("Update Usuario Set DELETED = 'S' Where USU_Id = $1;", id).then(()=>{
        res.status(200).send("Usuário deletado!");
    }).catch(error => {
        res.status(500).send("Erro ao deletar usuário: " + error.message); 
    });
});

app.put("/usuarios/:id", function (req, res) {
    const id = parseInt(req.params.id);
    db_pg.none("Update Usuario \
    Set USU_Nome = $2, USU_Celular = $3, USU_Email = $4, USU_Senha = $5, USU_Administrador = $6, USU_Data_Cadastro = $7 Where USU_Id = $1 And DELETED is NULL;", 
    [id, req.body.usu_nome, req.body.usu_celular, req.body.usu_email, req.body.usu_senha, req.body.usu_administrador, req.body.usu_data_cadastro]).then(()=>{
        res.status(200).send("Usuário atualizado!");
    }).catch(error => {
        res.status(500).send("Erro ao atualizar usuário: " + error.message); 
    });
});


//CRUD CLIENTE
app.get("/clientes", async function (req, res) {
    let dbclientes = await db_pg.any("SELECT * FROM Cliente Where Deleted is NULL;");
    res.status(200).send(dbclientes);
});

app.get("/clientes/:id", async function (req, res) {
    const id = parseInt(req.params.id);
    await db_pg.one("SELECT * FROM Cliente WHERE Cli_ID = $1 AND DELETED is NULL;", id).then(dbcliente =>{
        res.status(200).send(dbcliente);
    }).catch(error => {
        res.status(500).send("Erro ao consultar cliente: " + error.message);    
    });
});

app.post("/clientes", function (req, res) {
    db_pg.none("INSERT INTO cliente(cli_cpf, cli_nome, cli_celular, cli_estado, cli_cidade, cli_logradouro, cli_numero, cli_complemento, cli_email, cli_data_nascimento, deleted) \
        VALUES ($1, $2, $3, $4, $5, $6, $8, $9, $10, $11, NULL);", 
        [req.body.cli_cpf, req.body.cli_nome, req.body.cli_celular, req.body.cli_estado, req.body.cli_cidade, req.body.cli_logradouro, req.body.cli_numero, req.body.cli_complemento, req.body.cli_email, req.body.cli_data_nascimento]).then(()=>{
        res.status(200).send("Cliente inserido!");
    }).catch(error => {
        res.status(500).send("Erro ao inserir cliente: " + error.message); 
    });
});

app.delete("/clientes/:id", function (req, res) {
    const id = parseInt(req.params.id);
    db_pg.none("Update Cliente Set DELETED = 'S' Where cli_Id = $1;", id).then(()=>{
        res.status(200).send("Cliente deletado!");
    }).catch(error => {
        res.status(500).send("Erro ao deletar cliente: " + error.message); 
    });
});

app.put("/clientes/:id", function (req, res) {
    const id = parseInt(req.params.id);
    db_pg.none("UPDATE pcliente \
	SET cli_cpf=$2, cli_nome=$3, cli_celular=$4, cli_estado=$5, cli_cidade=$6, cli_logradouro=$7, cli_numero=$8, cli_complemento=$9, cli_email=$10, cli_data_nascimento=$11 \
	WHERE cli_id = $1;", 
    [id, req.body.cli_cpf, req.body.cli_nome, req.body.cli_celular, req.body.cli_estado, req.body.cli_cidade, req.body.cli_logradouro, req.body.cli_numero, req.body.cli_complemento, req.body.cli_email, req.body.cli_data_nascimento]).then(()=>{
        res.status(200).send("Cliente atualizado!");
    }).catch(error => {
        res.status(500).send("Erro ao atualizar cliente: " + error.message); 
    });
});


//CRUD RESERVA
app.get("/reservas", async function (req, res) {
    let dbreservas = await db_pg.any("SELECT * FROM Reserva Where Deleted is NULL;");
    res.status(200).send(dbreservas);
});

app.get("/reservas/:id", async function (req, res) {
    const id = parseInt(req.params.id);
    await db_pg.one("SELECT * FROM Reserva WHERE Res_ID = $1 AND DELETED is NULL;", id).then(dbreserva =>{
        res.status(200).send(dbreserva);
    }).catch(error => {
        res.status(500).send("Erro ao consultar reserva: " + error.message);    
    });
});

app.post("/reservas", async function (req, res) {
    let quantidade = await db_pg.one("SELECT hos_lim_hospedes FROM Hospedagem WHERE Hos_ID = $1 AND DELETED is NULL;", req.body.res_cliente);
    if(parseInt(req.body.res_qtd_adultos) > parseInt(quantidade)){
        res.status(500).send("A quantidade de adultos é maior que o limite da hospedagem.");
    }
    let temBloqueio = await db_pg.any("Select 1 From Bloqueio Where Blo_Hospedagem = $1 And (Blo_Data_inicial <= $2 And Blo_Data_Final >= $3)", req.body.res_hospedagem, req.body.res_data_final, req.body.res_data_inicial);
    if(parseInt(temBloqueio) === 1){
        res.status(500).send("Existe um bloqueio cadastrado para esse período.");
    }
    db_pg.none("INSERT INTO Reserva (Res_Descricao, Res_Hospedagem, Res_CheckIn, Res_CheckOut, Res_Qtd_Diarias, Res_Qtd_Adultos, Res_Qtd_Criancas, Res_Cliente, Res_Status, Res_Observacao, Res_Taxa_Limpeza) VALUES \
    ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)", 
    [req.body.Res_Descricao, req.body.Res_Hospedagem, req.body.Res_CheckIn, req.body.Res_CheckOut, req.body.Res_Qtd_Diarias, req.body.Res_Qtd_Adultos, req.body.Res_Qtd_Criancas, req.body.Res_Cliente, req.body.Res_Status, req.body.Res_Observacao, req.body.Res_Taxa_Limpeza]).then(()=>{
        res.status(200).send("Reserva inserida!");
    }).catch(error => {
        res.status(500).send("Erro ao inserir reserva: " + error.message); 
    });    
});

app.delete("/reservas/:id", function (req, res) {
    //Ao deletar, deletar também os adicionais e pagamento
    const id = parseInt(req.params.id);
    db_pg.none("Update Reserva Set DELETED = 'S' Where res_Id = $1; \
    Update Reserva_Servico Set DELETED = 'S' Where rse_Reserva = $1; \
    Update Pagamento_Reserva Set DELETED = 'S' Where Pre_Reserva = $1;", id).then(()=>{
        res.status(200).send("Reserva deletada!");
    }).catch(error => {
        res.status(500).send("Erro ao deletar reserva: " + error.message); 
    });
});

app.put("/reservas/:id", function (req, res) {
    const id = parseInt(req.params.id);
    db_pg.none("UPDATE reserva\
    SET res_descricao=$2, res_hospedagem=$3, res_checkin=$4, res_checkout=$5, res_qtd_diarias=$6, res_qtd_adultos=$7, \
    res_qtd_criancas=$8, res_data_cadastro=$9, res_cliente=$10, res_status=$11, res_observacao=$12, res_taxa_limpeza=$13 \
	WHERE res_id = $1;", 
    [id, req.body.Res_Descricao, req.body.Res_Hospedagem, req.body.Res_CheckIn, req.body.Res_CheckOut, req.body.Res_Qtd_Diarias, req.body.Res_Qtd_Adultos, req.body.Res_Qtd_Criancas, req.body.Res_Cliente, req.body.Res_Status, req.body.Res_Observacao, req.body.Res_Taxa_Limpeza]).then(()=>{
        res.status(200).send("Reserva atualizada!");
    }).catch(error => {
        res.status(500).send("Erro ao atualizar reserva: " + error.message); 
    });
});

//CRUD BLOQUEIO
//Ao cadastrar ou alterar, validar se não existe alguma reserva já cadastrada para o período

app.get("/bloqueios", async function (req, res) {
    let dbbloqueios = await db_pg.any("SELECT * FROM Bloqueio Where Deleted is NULL;");
    res.status(200).send(dbbloqueios);
});

app.get("/bloqueios/:id", async function (req, res) {
    const id = parseInt(req.params.id);
    await db_pg.one("SELECT * FROM Bloqueio WHERE blo_ID = $1 AND DELETED is NULL;", id).then(dbbloqueio =>{
        res.status(200).send(dbbloqueio);
    }).catch(error => {
        res.status(500).send("Erro ao consultar bloqueio: " + error.message);    
    });
});

app.post("/bloqueios", function (req, res) {
    db_pg.none("INSERT INTO Bloqueio (Blo_Hospedagem, Blo_Observacao, Blo_Data_Inicial, Blo_Data_Final) VALUES\
    ($1, $2, $3, $4);", [req.body.blo_hospedagem, req.body.Blo_Observacao, req.body.Blo_Data_Inicial, req.body.Blo_Data_Final]).then(()=>{
        res.status(200).send("Bloqueio inserido!");
    }).catch(error => {
        res.status(500).send("Erro ao inserir bloqueio: " + error.message); 
    });   
});

app.delete("/bloqueios/:id", function (req, res) {
    const id = parseInt(req.params.id);
    db_pg.none("Update Bloqueio Set DELETED = 'S' Where blo_Id = $1;", id).then(()=>{
        res.status(200).send("Bloqueio deletado!");
    }).catch(error => {
        res.status(500).send("Erro ao deletar bloqueio: " + error.message); 
    });
});

app.put("/bloqueios/:id", function (req, res) {
    const id = parseInt(req.params.id);
    db_pg.none("UPDATE bloqueio \
	SET blo_hospedagem=$2, blo_observacao=$3, blo_data_inicial=$4, blo_data_final=$5 \
	WHERE blo_id = $1;", 
    [id, req.body.Blo_Hospedagem, req.body.Blo_Observacao, req.body.Blo_Data_Inicial, req.body.Blo_Data_Final]).then(()=>{
        res.status(200).send("Bloqueio atualizado!");
    }).catch(error => {
        res.status(500).send("Erro ao atualizar bloqueio: " + error.message); 
    });
});

//CRUD DESPESA
app.get("/despesas", async function (req, res) {
    let dbdespesas = await db_pg.any("SELECT * FROM Despesa Where Deleted is NULL;");
    res.status(200).send(dbdespesas);
});

app.get("/despesas/:id", async function (req, res) {
    const id = parseInt(req.params.id);
    await db_pg.one("SELECT * FROM Despesa WHERE Des_ID = $1 AND DELETED is NULL;", id).then(dbdespesa =>{
        res.status(200).send(dbdespesa);
    }).catch(error => {
        res.status(500).send("Erro ao consultar despesa: " + error.message);    
    });
});

app.post("/despesas", function (req, res) {
    db_pg.none("INSERT INTO Despesa (Des_Descricao, Des_Valor, Des_Data_Vencimento, Des_Data_Pagamento, Des_Parcelado, Des_Recorrente, Des_Qtd_Parcelas, Des_Tipo_Pagamento, Des_Pago, Des_Categoria) VALUES \
    ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)", 
    [req.body.Des_Descricao, req.body.Des_Valor, req.body.Des_Data_Vencimento, req.body.Des_Data_Pagamento, req.body.Des_Parcelado, req.body.Des_Recorrente, req.body.Des_Qtd_Parcelas, req.body.Des_Tipo_Pagamento, req.body.Des_Pago, req.body.Des_Categoria]).then(()=>{
        res.status(200).send("Despesa inserida!");
    }).catch(error => {
        res.status(500).send("Erro ao inserir despesa: " + error.message); 
    });
});

app.delete("/despesas/:id", function (req, res) {
    const id = parseInt(req.params.id);
    db_pg.none("Update Despesa Set DELETED = 'S' Where Des_Id = $1;", id).then(()=>{
        res.status(200).send("Despesa deletada!");
    }).catch(error => {
        res.status(500).send("Erro ao deletar despesa: " + error.message); 
    });
});

app.put("/despesas/:id", function (req, res) {
    const id = parseInt(req.params.id);
    db_pg.none("UPDATE despesa\
    des_descricao=$2, des_valor=$3, des_data_vencimento=$4, des_data_pagamento=$5, des_parcelado=$6, des_recorrente=$7, des_qtd_parcelas=$8, des_tipo_pagamento=$9, des_pago=$10, des_categoria=$11 \
	WHERE Des_Id = $1;", 
    [id, req.body.Des_Descricao, req.body.Des_Valor, req.body.Des_Data_Vencimento, req.body.Des_Data_Pagamento, req.body.Des_Parcelado, req.body.Des_Recorrente, req.body.Des_Qtd_Parcelas, req.body.Des_Tipo_Pagamento, req.body.Des_Pago, req.body.Des_Categoria]).then(()=>{
        res.status(200).send("Despesa atualizada!");
    }).catch(error => {
        res.status(500).send("Erro ao atualizar despesa: " + error.message); 
    });
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
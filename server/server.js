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
app.get("/catdes", async function (req, res) {
    let dbcategoriadespesa = await db_pg.any("SELECT * FROM Categoria_Despesa Where Deleted is NULL;");
    res.status(200).send(dbcategoriadespesa);
});

app.get("/catdes/:id", async function (req, res) {
    const id = parseInt(req.params.id);
    await db_pg.one("SELECT * FROM Categoria_Despesa WHERE CDe_ID = $1 AND DELETED is NULL;", id).then(dbcategoriadespesa =>{
        res.status(200).send(dbcategoriadespesa);
    }).catch(error => {
        res.status(500).send("Erro ao consultar categoria de despesa: " + error.message);    
    });
});

app.post("/catdes", function (req, res) {
    db_pg.none("INSERT INTO Categoria_Despesa (CDe_Descricao) VALUES ($1)", 
    [req.body.Cde_Descricao]).then(()=>{
        res.status(200).send("Categoria de despesa inserida!");
    }).catch(error => {
        res.status(500).send("Erro ao inserir categoria de despesa: " + error.message); 
    });
});

app.delete("/catdes/:id", function (req, res) {
    const id = parseInt(req.params.id);
    db_pg.none("Update Categoria_Despesa Set DELETED = 'S' Where CDe_Id = $1;", id).then(()=>{
        res.status(200).send("Categoria de despesa deletada!");
    }).catch(error => {
        res.status(500).send("Erro ao deletar categoria de despesa: " + error.message); 
    });
});

app.put("/catdes/:id", function (req, res) {
    const id = parseInt(req.params.id);
    db_pg.none("UPDATE categoria_despesa	SET cde_descricao=$2 WHERE $1;", 
    [id, req.body.Cde_Descricao]).then(()=>{
        res.status(200).send("Categoria de despesa atualizada!");
    }).catch(error => {
        res.status(500).send("Erro ao atualizar categoria de despesa: " + error.message); 
    });
});

//CRUD PAGAMENTO_RESERVA
app.get("/pagamentos", async function (req, res) {
    let dbpagamento = await db_pg.any("SELECT * FROM Pagamento_Reserva Where Deleted is NULL;");
    res.status(200).send(dbpagamento);
});

app.get("/pagamentos/:id", async function (req, res) {
    const id = parseInt(req.params.id);
    await db_pg.one("SELECT * FROM Pagamento_Reserva WHERE PRe_Reserva = $1 AND DELETED is NULL;", id).then(dbpagamento =>{
        res.status(200).send(dbpagamento);
    }).catch(error => {
        res.status(500).send("Erro ao consultar pagamento: " + error.message);    
    });
});

app.post("/pagamentos", function (req, res) {
    db_pg.none("INSERT INTO Pagamento_Reserva (PRe_Reserva, PRe_Valor_Total, PRe_Data_Pagamento, PRe_Parcelado, PRe_Forma_Pagamento, PRe_Observacao) VALUES \
    ($1, $2, $3, $4, $5, $6)", 
    [req.body.PRe_Reserva, req.body.PRe_Valor_Total, req.body.PRe_Data_Pagamento, req.body.PRe_Parcelado, req.body.PRe_Forma_Pagamento, req.body.PRe_Observacao]).then(()=>{
        res.status(200).send("Pagamento inserido!");
    }).catch(error => {
        res.status(500).send("Erro ao inserir pagamento: " + error.message); 
    });
});

app.delete("/pagamentos/:id", function (req, res) {
    const id = parseInt(req.params.id);
    db_pg.none("Update Pagamento_Reserva Set DELETED = 'S' Where PRe_Reserva = $1;", id).then(()=>{
        res.status(200).send("Pagamento deletado!");
    }).catch(error => {
        res.status(500).send("Erro ao deletar pagamento: " + error.message); 
    });
});

app.put("/pagamentos/:id", function (req, res) {
    const id = parseInt(req.params.id);
    db_pg.none("UPDATE pagamento_reserva \
	SET pre_valor_total=$2, pre_data_pagamento=$3, pre_parcelado=$4, pre_forma_pagamento=$5, pre_observacao=$6 \
	WHERE PRe_reserva = $1;", 
    [id, req.body.PRe_Valor_Total, req.body.PRe_Data_Pagamento, req.body.PRe_Parcelado, req.body.PRe_Forma_Pagamento, req.body.PRe_Observacao]).then(()=>{
        res.status(200).send("Pagamento atualizado!");
    }).catch(error => {
        res.status(500).send("Erro ao atualizar pagamento: " + error.message); 
    });
});

//CRUD SERVICO_ADICIONAL
app.get("/servicos", async function (req, res) {
    let dbservicos = await db_pg.any("SELECT * FROM Servico_Adicional Where Deleted is NULL;");
    res.status(200).send(dbservicos);
});

app.get("/servicos/:id", async function (req, res) {
    const id = parseInt(req.params.id);
    await db_pg.one("SELECT * FROM Servico_Adicional WHERE SAd_ID = $1 AND DELETED is NULL;", id).then(dbservicos =>{
        res.status(200).send(dbservicos);
    }).catch(error => {
        res.status(500).send("Erro ao consultar serviço: " + error.message);    
    });
});

app.post("/servicos", function (req, res) {
    db_pg.none("INSERT INTO Servico_Adicional (SAd_Descricao, SAd_Valor, SAd_Custo, SAd_Detalhes) VALUES \
    ($1, $2, $3, $4)", 
    [req.body.SAd_Descricao, req.body.SAd_Valor, req.body.SAd_Custo, req.body.SAd_Detalhes]).then(()=>{
        res.status(200).send("Serviço inserido!");
    }).catch(error => {
        res.status(500).send("Erro ao inserir serviço: " + error.message); 
    });
});

app.delete("/servicos/:id", function (req, res) {
    const id = parseInt(req.params.id);
    db_pg.none("Update Servico_Adicional Set DELETED = 'S' Where SAd_ID = $1;", id).then(()=>{
        res.status(200).send("Serviço deletado!");
    }).catch(error => {
        res.status(500).send("Erro ao deletar serviço: " + error.message); 
    });
});

app.put("/servicos/:id", function (req, res) {
    const id = parseInt(req.params.id);
    db_pg.none("UPDATE servico_adicional \
	SET sad_descricao=$2, sad_valor=$3, sad_custo=$4, sad_detalhes=$5 \
	WHERE sad_id=$1;", 
    [id, req.body.SAd_Descricao, req.body.SAd_Valor, req.body.SAd_Custo, req.body.SAd_Detalhes]).then(()=>{
        res.status(200).send("Serviço atualizado!");
    }).catch(error => {
        res.status(500).send("Erro ao atualizar serviço: " + error.message); 
    });
});

//CRUD SERVICO POR RESERVA
app.get("/servreserva", async function (req, res) {
    let dbservreserva = await db_pg.any("SELECT * FROM reserva_servico Where Deleted is NULL;");
    res.status(200).send(dbservreserva);
});

app.get("/servreserva/:reserva/:servico", async function (req, res) {
    const preserva = parseInt(req.params.reserva);
    const pservico = parseInt(req.params.servico);

    await db_pg.one("SELECT * FROM reserva_servico WHERE rse_reserva = $1 AND rse_servico = $2 AND DELETED is NULL;", [preserva, pservico]).then(dbservreserva =>{
        res.status(200).send(dbservreserva);
    }).catch(error => {
        res.status(500).send("Erro ao consultar serviço por reserva: " + error.message);    
    });
});

app.get("/servreserva/:reserva", async function (req, res) {
    const preserva = parseInt(req.params.reserva);

    await db_pg.all("SELECT * FROM reserva_servico WHERE rse_reserva = $1 AND DELETED is NULL;", preserva).then(dbservreserva =>{
        res.status(200).send(dbservreserva);
    }).catch(error => {
        res.status(500).send("Erro ao consultar serviço por reserva: " + error.message);    
    });
});

app.post("/servreserva", function (req, res) {
    db_pg.none("INSERT INTO reserva_servico (rse_reserva, rse_servico, rse_quantidade, rse_data_cadastro, rse_observacao) VALUES \
    ($1, $2, $3, $4, $5)", 
    [req.body.rse_reserva, req.body.rse_servico, req.body.rse_quantidade, req.body.rse_data_cadastro, req.body.rse_observacao]).then(()=>{
        res.status(200).send("Serviço inserido para a reserva!");
    }).catch(error => {
        res.status(500).send("Erro ao inserir serviço por reserva: " + error.message); 
    });
});

app.delete("/servreserva/:reserva/:servico", function (req, res) {
    const preserva = parseInt(req.params.reserva);
    const pservico = parseInt(req.params.servico);
    db_pg.none("Update reserva_servico Set DELETED = 'S' Where rse_reserva = $1 AND rse_servico = $2;", [preserva, pservico]).then(()=>{
        res.status(200).send("Serviço deletado da reserva!");
    }).catch(error => {
        res.status(500).send("Erro ao deletar serviço por reserva: " + error.message); 
    });
});

app.put("/servreserva/:reserva/:servico", function (req, res) {
    const preserva = parseInt(req.params.reserva);
    const pservico = parseInt(req.params.servico);

    db_pg.none("UPDATE reserva_servico \
	SET rse_quantidade=$3, rse_data_cadastro=$4, rse_observacao=$5 \
	WHERE rse_reserva=$1 AND rse_servico=$2;", 
    [preserva, pservico, req.body.rse_quantidade, req.body.rse_data_cadastro, req.body.rse_observacao]).then(()=>{
        res.status(200).send("Serviço atualizado na reserva!");
    }).catch(error => {
        res.status(500).send("Erro ao atualizar serviço por reserva: " + error.message); 
    });
});

//CRUD HOSPEDAGEM
app.get("/hospedagem", async function (req, res) {
    let dbhospedagem = await db_pg.any("SELECT * FROM hospedagem Where Deleted is NULL;");
    res.status(200).send(dbhospedagem);
});

app.get("/hospedagem/:id", async function (req, res) {
    const id = parseInt(req.params.id);
    await db_pg.one("SELECT * FROM Hospedagem WHERE Hos_ID = $1 AND DELETED is NULL;", id).then(dbhospedagem =>{
        res.status(200).send(dbhospedagem);
    }).catch(error => {
        res.status(500).send("Erro ao consultar hospedagem: " + error.message);    
    });
});

app.post("/hospedagem", function (req, res) {
    db_pg.none("INSERT INTO Hospedagem (Hos_Nome, Hos_Lim_Hospedes, Hos_Valor_Limpeza) VALUES \
    ($1, $2, $3)", 
    [req.body.Hos_Nome, req.body.Hos_Lim_Hospedes, req.body.Hos_Valor_Limpeza]).then(()=>{
        res.status(200).send("Hospedagem inserida!");
    }).catch(error => {
        res.status(500).send("Erro ao inserir hospedagem: " + error.message); 
    });
});

app.delete("/hospedagem/:id", function (req, res) {
    const id = parseInt(req.params.id);
    db_pg.none("Update Hospedagem Set DELETED = 'S' Where Hos_ID = $1;\
                Update Valor_Hospedagem Set DELETED = 'S' Where VHo_Hospedagem = $1;", id).then(()=>{
        res.status(200).send("Hospedagem deletada!");
    }).catch(error => {
        res.status(500).send("Erro ao deletar hospedagem: " + error.message); 
    });
});

app.put("/hospedagem/:id", function (req, res) {
    const id = parseInt(req.params.id);
    db_pg.none("UPDATE hospedagem \
	SET hos_nome=$2, hos_lim_hospedes=$3, hos_valor_limpeza=$4 \
	WHERE hos_id=$1;", 
    [id, req.body.Hos_Nome, req.body.Hos_Lim_Hospedes, req.body.Hos_Valor_Limpeza]).then(()=>{
        res.status(200).send("Hospedagem atualizada!");
    }).catch(error => {
        res.status(500).send("Erro ao atualizar hospedagem: " + error.message); 
    });
});

//CRUD VALOR HOSPEDAGEM
app.get("/valorh", async function (req, res) {
    let dbvalhospedagem = await db_pg.any("SELECT * FROM valor_hospedagem Where Deleted is NULL;");
    res.status(200).send(dbvalhospedagem);
});

app.get("/valorh/:hospedagem/:dia_semana", async function (req, res) {
    const hospedagem = parseInt(req.params.hospedagem);
    const dia_semana = parseInt(req.params.dia_semana);

    await db_pg.one("SELECT * FROM valor_hospedagem WHERE vho_hospedagem=$1 AND vho_dia_semana=$2 AND DELETED is NULL;", [hospedagem, dia_semana]).then(dbvalhospedagem =>{
        res.status(200).send(dbvalhospedagem);
    }).catch(error => {
        res.status(500).send("Erro ao consultar valor da hospedagem: " + error.message);    
    });
});

app.get("/valorh/:hospedagem", async function (req, res) {
    const hospedagem = parseInt(req.params.hospedagem);

    await db_pg.all("SELECT * FROM valor_hospedagem WHERE vho_hospedagem=$1 AND DELETED is NULL;", hospedagem).then(dbvalhospedagem =>{
        res.status(200).send(dbvalhospedagem);
    }).catch(error => {
        res.status(500).send("Erro ao consultar valores da hospedagem: " + error.message);    
    });
});

app.post("/valorh", function (req, res) {
    db_pg.none("INSERT INTO Valor_Hospedagem (VHo_Hospedagem, VHo_Dia_Semana, VHo_Valor) VALUES \
    ($1, $2, $3)", 
    [req.body.VHo_Hospedagem, req.body.VHo_Dia_Semana, req.body.VHo_Valor]).then(()=>{
        res.status(200).send("Valor inserido!");
    }).catch(error => {
        res.status(500).send("Erro ao inserir valor: " + error.message); 
    });
});

app.delete("/valorh/:hospedagem/:dia_semana", function (req, res) {
    const hospedagem = parseInt(req.params.hospedagem);
    const dia_semana = parseInt(req.params.dia_semana);

    db_pg.none("UPDATE valor_hospedagem \
	SET deleted='S' \
	WHERE vho_hospedagem=$1, vho_dia_semana=$2;", [hospedagem, dia_semana]).then(()=>{
        res.status(200).send("Valor deletado!");
    }).catch(error => {
        res.status(500).send("Erro ao deletar valor: " + error.message); 
    });
});

app.put("/valorh/:hospedagem/:dia_semana", function (req, res) {
    const hospedagem = parseInt(req.params.hospedagem);
    const dia_semana = parseInt(req.params.dia_semana);

    const id = parseInt(req.params.id);
    db_pg.none("UPDATE valor_hospedagem \
	SET vho_valor=$3 \
	WHERE vho_hospedagem=$1, vho_dia_semana=$2;", 
    [hospedagem, dia_semana, req.body.VHo_Valor]).then(()=>{
        res.status(200).send("Valor atualizado!");
    }).catch(error => {
        res.status(500).send("Erro ao atualizar valor: " + error.message); 
    });
});
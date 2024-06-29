const database = {
  usuario: [
    {
      id: 1,
      nome: "Admin",
      celular: "(99)99999-9999",
      email: "admin@admin.com",
      senha: "password",
      administrador: true,
      data_cadastro: '2024-06-29'
    }
  ],
  reserva: [
    {
      id: 1,
      descricao: "Evento 1",
      hospedagem: 1,
      checkin: '2024-06-20',
      checkout: '2024-06-20',
      qtde_diarias: 1,
      qtde_adultos: 2,
      qtde_criancas: 0,
      data_cadastro: '2024-06-29',
      cliente: 1,
      status: 1,
      taxa_limpeza: true,
      data_edicao: '2024-06-29'
    },
    {
      id: 2,
      descricao: "Evento 2",
      hospedagem: 1,
      checkin: '2024-06-22',
      checkout: '2024-06-22',
      qtde_diarias: 1,
      qtde_adultos: 2,
      qtde_criancas: 1,
      data_cadastro: '2024-06-29',
      cliente: 1,
      status: 1,
      taxa_limpeza: true,
      data_edicao: '2024-06-29'
    },
  ],
  hospedagem: [
    {
      id: 1,
      nome: "TilliBus",
      lim_hospedes: 4,
      valor_limpeza: 100.00
    },
    {
      id: 2,
      nome: "TinyHouse",
      lim_hospedes: 2,
      valor_limpeza: 80.00
    },
  ],
  cliente: [
    {
      id: 1,
      cpf: "99999999999",
      nome: "Teste de teste",
      celular: "(99)99999-9999",
      estado: "Santa Catarina",
      cidade: "Chapecó",
      logradouro: "Rua teste",
      numero: "99",
      complemento: "",
      email: "teste@teste.com",
      data_nascimento: '2000-01-01'
    },
  ],
  status: [
    {
      id: 1,
      descricao: "Agendado"
    },
    {
      id: 2,
      descricao: "Pendente"
    },
    {
      id: 3,
      descricao: "Pago"
    },
  ],
  bloqueio: [
    {
      id: 1,
      hospedagem: 1,
      observacao: "Teste bloqueio",
      data_inicial: '2024-06-10',
      data_final: '2024-06-12',
      data_cadastro: '2024-06-05'
    },
  ],
};
module.exports = database;
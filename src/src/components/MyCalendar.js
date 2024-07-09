import React, { useEffect, useState } from 'react';
import axios from 'axios';
import FullCalendar from '@fullcalendar/react'; // Importa o componente principal
import dayGridPlugin from '@fullcalendar/daygrid'; // Importa o plugin para a visualização mensal
import timeGridPlugin from '@fullcalendar/timegrid'; // Importa o plugin para a visualização semanal
import interactionPlugin from '@fullcalendar/interaction'; // Importa o plugin para interação (como clicar e arrastar eventos)
import allLocales from '@fullcalendar/core/locales-all'; // Importa todos os locais
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, FormControl, InputLabel, Select, MenuItem, Checkbox, FormControlLabel, Grid, Typography, IconButton, Tabs, Tab, Table, TableHead, TableBody, TableRow, TableCell } from '@mui/material'; // Importa componentes do Material-UI
import AddCircleIcon from '@mui/icons-material/AddCircle'; // Ícone de adicionar cliente
import DeleteIcon from '@mui/icons-material/Delete'; // Ícone de lixeira

const MyCalendar = () => {
  const [events, setEvents] = useState([ // Estado inicial com exemplos de eventos estáticos
   /* { title: 'Evento 1', date: '2024-06-20' },
    { title: 'Evento 2', date: '2024-06-22' }*/
  ]);

  const [listaAdicionais, setAdicionaisList] = useState([]);
  const [listaClientes, setClientesList] = useState([]);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await axios.get('/reservas');
      const data = response.data;
      const fetchedEvents = data.map(event => ({
        title: event.res_descricao,
        start: event.res_checkin,
        end: event.res_checkout,
        id: event.res_id
      }));
      setEvents(fetchedEvents);
    } catch (error) {
      console.error('Erro ao buscar eventos:', error);
    }
  };

  const fetchAdicionais = async () => {
    try {
      const response = await axios.get('/servicos');
      const data = response.data;
      setAdicionaisList(data);
    } catch (error) {
      console.error('Erro ao buscar adicionais:', error);
    }
  };

  const fetchClientes = async () => {
    try {
      const response = await axios.get('/clientes');
      const data = response.data;
      setClientesList(data);
    } catch (error) {
      console.error('Erro ao buscar adicionais:', error);
    }
  };


  const [openModal, setOpenModal] = useState(false);
  const [eventData, setEventData] = useState({
    hospedagemTilliBus: false,
    hospedagemTinyHouse: false,
    nomeReserva: '',
    cliente: '',
    dataCheckIn: '',
    quantidadeDiarias: '',
    quantidadeCriancas: 0,
    quantidadeAdultos: 1,
    valorFinal: 0,
    dataCheckOut: '', // Novo campo para armazenar a data de Check Out
    observacao: '' // Novo campo de observação

  });

  const [adicionais, setAdicionais] = useState([]);
  const [adicionalData, setAdicionalData] = useState({
    descricao: '',
    quantidade: 1,
    valor: 0,
    observacao: ''
  });

  const [openClienteModal, setOpenClienteModal] = useState(false);
  const [clienteData, setClienteData] = useState({
    nome: '',
    cpf: '',
    telefone: '',
    email: '',
    dataNascimento: '',
    endereco: {
      cidade: '',
      estado: '',
      logradouro: '',
      numero: ''
    }
  });

  const [openBloqueioModal, setOpenBloqueioModal] = useState(false);
  const [bloqueioData, setBloqueioData] = useState({
    hospedagemTilliBus: false,
    hospedagemTinyHouse: false,
    dataInicio: '',
    dataFim: '',
    observacao: ''
  });

  const [tabIndex, setTabIndex] = useState(0);

  const handleDateClick = (arg) => {
    setEventData({
      ...eventData,
      dataCheckIn: arg.dateStr,
      dataCheckOut: calculateCheckOutDate(arg.dateStr, eventData.quantidadeDiarias) // Calcula o Check Out automaticamente ao selecionar a data de Check In
    });
    fetchAdicionais();
    fetchClientes();
    setOpenModal(true);
  };

  const calculateCheckOutDate = (checkInDate, quantidadeDiarias) => {
    if (!checkInDate || !quantidadeDiarias) return '';

    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkIn);
    checkOut.setDate(checkOut.getDate() + parseInt(quantidadeDiarias));
    
    return checkOut.toISOString().split('T')[0]; // Retorna no formato 'yyyy-mm-dd'
  };

  const handleReservaSubmit = async () => {
    try {
      const data = {
        Res_Descricao: eventData.nomeReserva,
        Res_CheckIn: eventData.dataCheckIn,
        Res_CheckOut: eventData.dataCheckOut,
        Res_Qtd_Diarias: eventData.quantidadeDiarias,
        Res_Qtd_Adultos: eventData.quantidadeAdultos,
        Res_Qtd_Criancas: eventData.quantidadeCriancas,
        Res_Cliente: eventData.cliente,
        Res_Status: 3,
        Res_Observacao: eventData.observacao,
        Res_Taxa_Limpeza: false
      };
  
      if (eventData.hospedagemTilliBus) {
        data.Res_Hospedagem = 1;
      } else if (eventData.hospedagemTinyHouse) {
        data.Res_Hospedagem = 2;
      }
  
      const response = await axios.post('/reservas', data);
      const reservaId = response.data.res_id;

      // Envia os adicionais associados à reserva
      for (const adicional of adicionais) {
        const adicionalData = {
          rse_reserva: reservaId,
          rse_servico: adicional.descricao,
          rse_quantidade: adicional.quantidade,
          rse_observacao: adicional.observacao
        };
        await axios.post('/servreserva', adicionalData);
      }
  
      console.log('Dados da reserva e adicionais enviados:', data, adicionais);
      handleCloseModal();
    } catch (error) {
      console.error('Erro ao enviar reserva e adicionais:', error);
    }
    handleCloseModal();
  };
  
  const handleClienteSubmit = async () => {
    try {
      const data = {
        cli_cpf: clienteData.cpf,
        cli_nome: clienteData.nome,
        cli_celular: clienteData.telefone,
        cli_estado: clienteData.endereco.estado,
        cli_cidade: clienteData.endereco.cidade,
        cli_logradouro: clienteData.endereco.logradouro,
        cli_numero: clienteData.endereco.numero,
        cli_complemento: null,
        cli_email: clienteData.email,
        cli_data_nascimento: clienteData.dataNascimento
      };

      await axios.post('/clientes', data);
  
      console.log('Dados do cliente enviados:', data, adicionais);
      handleCloseModal();
    } catch (error) {
      console.error('Erro ao enviar cliente:', error);
    }    
    handleCloseClienteModal();
  };

  const handleBloqueioSubmit = async () => {
    try {
      const data = {
        Blo_Observacao: bloqueioData.observacao,
        Blo_Data_Inicial: bloqueioData.dataInicio,
        Blo_Data_Final: bloqueioData.dataFim
      };

      if (bloqueioData.hospedagemTilliBus) {
        data.Blo_Hospedagem = 1;
      } else if (bloqueioData.hospedagemTinyHouse) {
        data.Blo_Hospedagem = 2;
      }

      await axios.post('/bloqueios', data);
  
      console.log('Bloqueio enviado:', data, adicionais);
      handleCloseModal();
    } catch (error) {
      console.error('Erro ao enviar bloqueio:', error);
    } 
    console.log('Dados do bloqueio:', bloqueioData);
    handleCloseBloqueioModal();
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setEventData({
      hospedagemTilliBus: false,
      hospedagemTinyHouse: false,
      nomeReserva: '',
      cliente: '',
      dataCheckIn: '',
      quantidadeDiarias: '',
      quantidadeCriancas: 0,
      quantidadeAdultos: 1,
      valorFinal: 0,
      dataCheckOut: '' // Limpa também o campo de Check Out ao fechar o modal
    });
    setAdicionais([]);
    fetchEvents();
  };

  const handleCloseClienteModal = () => {
    setOpenClienteModal(false);
    setClienteData({
      nome: '',
      cpf: '',
      telefone: '',
      email: '',
      dataNascimento: '',
      endereco: {
        cidade: '',
        estado: '',
        logradouro: '',
        numero: ''
      }
    });
  };

  const handleCloseBloqueioModal = () => {
    setOpenBloqueioModal(false);
    setBloqueioData({
      hospedagemTilliBus: false,
      hospedagemTinyHouse: false,
      dataInicio: '',
      dataFim: '',
      observacao: ''
    });
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === 'hospedagemTilliBus' || name === 'hospedagemTinyHouse') {
      setEventData({
        ...eventData,
        hospedagemTilliBus: name === 'hospedagemTilliBus' ? checked : false,
        hospedagemTinyHouse: name === 'hospedagemTinyHouse' ? checked : false
      });
    } else if (name === 'quantidadeDiarias') {
      setEventData({
        ...eventData,
        quantidadeDiarias: value,
        dataCheckOut: calculateCheckOutDate(eventData.dataCheckIn, value) // Atualiza o Check Out ao mudar a quantidade de diárias
      });
    } else {
      setEventData({
        ...eventData,
        [name]: value
      });
    }
  };

  const handleBloqChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === 'hospedagemTilliBus' || name === 'hospedagemTinyHouse') {
      setBloqueioData({
        ...bloqueioData,
        hospedagemTilliBus: name === 'hospedagemTilliBus' ? checked : false,
        hospedagemTinyHouse: name === 'hospedagemTinyHouse' ? checked : false
      });
    } else {
      setBloqueioData({
        ...bloqueioData,
        [name]: value
      });
    }
  };

  const handleAdicionalChange = (e) => {
    const { name, value } = e.target;
    setAdicionalData({
      ...adicionalData,
      [name]: value
    });
  };

  const handleAddAdicional = () => {
    setAdicionais([...adicionais, adicionalData]);
    setAdicionalData({
      descricao: '',
      quantidade: 1,
      valor: 0,
      observacao: ''
    });
  };

  const handleRemoveAdicional = (index) => {
    setAdicionais(adicionais.filter((_, i) => i !== index));
  };

  return (
    <div>
      <div style={{ marginBottom: '10px' }}>
        <Button variant="contained" color="primary" onClick={() => setOpenModal(true)}>+ Reserva</Button>
        <Button variant="contained" color="secondary" style={{ marginLeft: '10px' }} onClick={() => setOpenBloqueioModal(true)}>Bloquear Agenda</Button>
      </div>
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        locales={allLocales}
        locale="pt-br"
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay'
        }}
        events={events}
        dateClick={handleDateClick}
      />

      {/* Modal para adicionar nova reserva */}
      <Dialog open={openModal} onClose={handleCloseModal} fullWidth maxWidth="md">
        <DialogTitle>Cadastrar Reserva</DialogTitle>
        <DialogContent>
          <Tabs value={tabIndex} onChange={(e, newValue) => setTabIndex(newValue)}>
            <Tab label="Detalhes" />
            <Tab label="Adicionais" />
          </Tabs>

          {tabIndex === 0 && (
            <div>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={eventData.hospedagemTilliBus}
                    onChange={handleInputChange}
                    name="hospedagemTilliBus"
                  />
                }
                label="TilliBus"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={eventData.hospedagemTinyHouse}
                    onChange={handleInputChange}
                    name="hospedagemTinyHouse"
                  />
                }
                label="Tiny House"
              />

              <TextField
                fullWidth
                label="Nome da Reserva"
                name="nomeReserva"
                value={eventData.nomeReserva}
                onChange={handleInputChange}
                sx={{ marginTop: '10px' }}
              />

              <Grid container spacing={2} sx={{ marginTop: '10px' }}>
                <Grid item xs={11}>
                  <FormControl fullWidth>
                    <InputLabel>Cliente</InputLabel>
                    <Select
                      name="cliente"
                      value={eventData.cliente}
                      onChange={handleInputChange}
                    >
                      {/* Aqui você pode adicionar opções de clientes existentes */}
                      {listaClientes.map((listaClientes) => (
                        <MenuItem key={listaClientes.cli_id} value={listaClientes.cli_id}>{listaClientes.cli_nome}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={1} sx={{ display: 'flex', alignItems: 'flex-end' }}>
                  <IconButton color="primary" onClick={() => setOpenClienteModal(true)}>
                    <AddCircleIcon />
                  </IconButton>
                </Grid>
              </Grid>

              <Grid container spacing={2} sx={{ marginTop: '10px' }}>
                <Grid item xs={4}>
                  <TextField
                    fullWidth
                    label="Data de Check-In"
                    type="date"
                    name="dataCheckIn"
                    value={eventData.dataCheckIn}
                    onChange={handleInputChange}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={4}>
                  <TextField
                    fullWidth
                    label="Quantidade de Diárias"
                    type="number"
                    name="quantidadeDiarias"
                    value={eventData.quantidadeDiarias}
                    onChange={handleInputChange}
                  />
                </Grid>
                <Grid item xs={4}>
                  <TextField
                    fullWidth
                    label="Check Out"
                    type="text"
                    name="dataCheckOut"
                    value={eventData.dataCheckOut}
                    InputProps={{ readOnly: true }}
                  />
                </Grid>
              </Grid>

              <Grid container spacing={2} sx={{ marginTop: '10px' }}>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Quantidade de Crianças"
                    type="number"
                    name="quantidadeCriancas"
                    value={eventData.quantidadeCriancas}
                    onChange={handleInputChange}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Quantidade de Adultos"
                    type="number"
                    name="quantidadeAdultos"
                    value={eventData.quantidadeAdultos}
                    onChange={handleInputChange}
                  />
                </Grid>
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Observação"
                  name="observacao"
                  value={eventData.observacao}
                  onChange={handleInputChange}
                  multiline
                  rows={4}
                  sx={{ marginTop: '10px' }}
                />
            </Grid>

            </div>
          )}

          {tabIndex === 1 && (
            <div>
              <FormControl fullWidth sx={{ marginTop: '10px' }}>
                <InputLabel>Descrição</InputLabel>
                <Select
                  name="descricao"
                  label="Descrição"
                  value={adicionalData.descricao}
                  onChange={handleAdicionalChange}
                >
                  {listaAdicionais.map((listaAdicionais) => (
                    <MenuItem key={listaAdicionais.sad_id} value={listaAdicionais.sad_id}>{listaAdicionais.sad_descricao}</MenuItem>
                  ))}
                </Select>
              </FormControl>

              <Grid container spacing={2} sx={{ marginTop: '10px' }}>
                <Grid item xs={4}>
                  <TextField
                    fullWidth
                    label="Quantidade"
                    type="number"
                    name="quantidade"
                    value={adicionalData.quantidade}
                    onChange={handleAdicionalChange}
                  />
                </Grid>
                <Grid item xs={4}>
                  <TextField
                    fullWidth
                    label="Valor"
                    type="number"
                    name="valor"
                    value={adicionalData.valor}
                    onChange={handleAdicionalChange}
                  />
                </Grid>
                <Grid item xs={4}>
                  <TextField
                    fullWidth
                    label="Observação"
                    name="observacao"
                    value={adicionalData.observacao}
                    onChange={handleAdicionalChange}
                  />
                </Grid>
              </Grid>

              <Button
                variant="contained"
                color="primary"
                onClick={handleAddAdicional}
                sx={{ marginTop: '10px' }}
              >
                Adicionar
              </Button>

              <Table sx={{ marginTop: '10px' }}>
                <TableHead>
                  <TableRow>
                    <TableCell>Descrição</TableCell>
                    <TableCell>Quantidade</TableCell>
                    <TableCell>Valor</TableCell>
                    <TableCell>Observação</TableCell>
                    <TableCell>Ações</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {adicionais.map((adicional, index) => (
                    <TableRow key={index}>
                      <TableCell>{adicional.descricao}</TableCell>
                      <TableCell>{adicional.quantidade}</TableCell>
                      <TableCell>{adicional.valor}</TableCell>
                      <TableCell>{adicional.observacao}</TableCell>
                      <TableCell>
                        <IconButton color="secondary" onClick={() => handleRemoveAdicional(index)}>
                          <DeleteIcon sx={{ color: 'red' }} />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal} color="secondary">Cancelar</Button>
          <Button onClick={handleReservaSubmit} color="primary">Reservar</Button>
        </DialogActions>
      </Dialog>

      {/* Modal para cadastrar novo cliente */}
      <Dialog open={openClienteModal} onClose={handleCloseClienteModal} fullWidth maxWidth="sm">
        <DialogTitle>Cadastrar Cliente</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            required
            label="Nome"
            name="nome"
            value={clienteData.nome}
            onChange={(e) => setClienteData({ ...clienteData, nome: e.target.value })}
            sx={{ marginBottom: '10px' }}
          />
          <TextField
            fullWidth
            required
            label="CPF"
            name="cpf"
            value={clienteData.cpf}
            onChange={(e) => setClienteData({ ...clienteData, cpf: e.target.value })}
            sx={{ marginBottom: '10px' }}
          />
          <TextField
            fullWidth
            required
            label="Telefone"
            name="telefone"
            value={clienteData.telefone}
            onChange={(e) => setClienteData({ ...clienteData, telefone: e.target.value })}
            sx={{ marginBottom: '10px' }}
          />
          <TextField
            fullWidth
            label="E-mail"
            name="email"
            value={clienteData.email}
            onChange={(e) => setClienteData({ ...clienteData, email: e.target.value })}
            sx={{ marginBottom: '10px' }}
          />
          <TextField
            fullWidth
            label="Data de Nascimento"
            type="date"
            name="dataNascimento"
            value={clienteData.dataNascimento}
            onChange={(e) => setClienteData({ ...clienteData, dataNascimento: e.target.value })}
            InputLabelProps={{ shrink: true }}
            sx={{ marginBottom: '10px' }}
          />
          <TextField
            fullWidth
            required
            label="Cidade"
            name="cidade"
            value={clienteData.endereco.cidade}
            onChange={(e) => setClienteData({ ...clienteData, endereco: { ...clienteData.endereco, cidade: e.target.value } })}
            sx={{ marginBottom: '10px' }}
          />
          <TextField
            fullWidth
            required
            label="Estado"
            name="estado"
            value={clienteData.endereco.estado}
            onChange={(e) => setClienteData({ ...clienteData, endereco: { ...clienteData.endereco, estado: e.target.value } })}
            sx={{ marginBottom: '10px' }}
          />
          <TextField
            fullWidth
            label="Logradouro"
            name="logradouro"
            value={clienteData.endereco.logradouro}
            onChange={(e) => setClienteData({ ...clienteData, endereco: { ...clienteData.endereco, logradouro: e.target.value } })}
            sx={{ marginBottom: '10px' }}
          />
          <TextField
            fullWidth
            label="Número"
            name="numero"
            value={clienteData.endereco.numero}
            onChange={(e) => setClienteData({ ...clienteData, endereco: { ...clienteData.endereco, numero: e.target.value } })}
            sx={{ marginBottom: '10px' }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseClienteModal} color="secondary">Cancelar</Button>
          <Button onClick={handleClienteSubmit} color="primary">Salvar Cliente</Button>
        </DialogActions>
      </Dialog>

      {/* Modal para bloquear agenda */}
      <Dialog open={openBloqueioModal} onClose={handleCloseBloqueioModal} fullWidth maxWidth="md">
        <DialogTitle>Bloquear Agenda</DialogTitle>
        <DialogContent>
        <FormControlLabel
                control={
                  <Checkbox
                    checked={bloqueioData.hospedagemTilliBus}
                    onChange={handleBloqChange}
                    name="hospedagemTilliBus"
                  />
                }
                label="TilliBus"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={bloqueioData.hospedagemTinyHouse}
                    onChange={handleBloqChange}
                    name="hospedagemTinyHouse"
                  />
                }
                label="Tiny House"
              />
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Data de Início"
                type="date"
                name="dataInicio"
                value={bloqueioData.dataInicio}
                onChange={(e) => setBloqueioData({ ...bloqueioData, dataInicio: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Data de Fim"
                type="date"
                name="dataFim"
                value={bloqueioData.dataFim}
                onChange={(e) => setBloqueioData({ ...bloqueioData, dataFim: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
          </Grid>

          <TextField
            fullWidth
            label="Observação"
            multiline
            rows={4}
            name="observacao"
            value={bloqueioData.observacao}
            onChange={(e) => setBloqueioData({ ...bloqueioData, observacao: e.target.value })}
            sx={{ marginTop: '10px' }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseBloqueioModal} color="secondary">Cancelar</Button>
          <Button onClick={handleBloqueioSubmit} color="primary">Bloquear</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default MyCalendar;
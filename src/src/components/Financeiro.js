import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container,
  Typography,
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Checkbox,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  FormControlLabel,
  Tabs,
  Tab,
  Paper,
  Grid
} from '@mui/material';



const Financeiro = () => {
  const [open, setOpen] = useState(false);
  const [openEditar, setOpenEditar] = useState(false);
  const [openDarBaixa, setOpenDarBaixa] = useState(false);
  const [contasAPagar, setContasAPagar] = useState([]);
  const [contasPagas, setContasPagas] = useState([]);
  const [formData, setFormData] = useState({
    descricao: '',
    valor: '',
    dataVencimento: '',
    parcelado: false,
    numeroParcelas: 1,
    formaPagamento: '',
    observacao: '',
    tipoDespesa: ''
  });

  const [selectedConta, setSelectedConta] = useState(null);
  const [selectedContasAPagar, setSelectedContasAPagar] = useState([]);

  useEffect(() => {
    fetchDespesas();
  }, []);

  const [tabValue, setTabValue] = useState(0);

  const fetchDespesas = async (dataInicial, dataFinal) => {
    try {
        let url = '/despesas';
        if (dataInicial && dataFinal) {
            url += `?dataInicial=${dataInicial}&dataFinal=${dataFinal}`;
        }
        const response = await axios.get(url);
        const data = response.data;
        if (Array.isArray(data)) {
            const despesasPagas = data.filter(despesa => despesa.des_pago === true);
            const despesasAPagar = data.filter(despesa => despesa.des_pago === false);
            setContasAPagar(despesasAPagar);
            setContasPagas(despesasPagas);
        }
    } catch (error) {
        console.error('Erro ao buscar despesas:', error);
    }
};



  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSave = async () => {
    try {
        const data = {
            Des_Descricao: formData.descricao,
            Des_Valor: formData.valor,
            Des_Data_Vencimento: formData.dataVencimento,
            Des_Parcelado: formData.parcelado,
            Des_Recorrente: false,
            Des_Qtd_Parcelas: formData.numeroParcelas,
            Des_Tipo_Pagamento: formData.formaPagamento,
            Des_Pago: false,
            Des_Categoria: formData.tipoDespesa
        };

        await axios.post('/despesas', data);
        fetchDespesas(); // Atualiza a lista após salvar
    } catch (error) {
        console.error('Erro ao enviar despesa:', error);
    }
    handleClose();
};


  const calcularTotalContas = (contas) => {
    const total = contas.reduce((total, conta) => total + parseFloat(conta.des_valor), 0);
    return total.toFixed(2);
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleOpenEditar = (conta) => {
    setSelectedConta(conta);
    setFormData({
      descricao: conta.des_descricao,
      valor: conta.des_valor,
      dataVencimento: conta.des_data_vencimento,
      parcelado: conta.des_parcelado,
      numeroParcelas: conta.des_qtd_parcelas,
      formaPagamento: conta.des_tipo_pagamento,
      observacao: conta.des_observacao || '',
      tipoDespesa: conta.des_categoria
    });
    setOpenEditar(true);
  };

  const handleCloseEditar = () => setOpenEditar(false);

  const handleUpdate = async () => {
    try {
      const data = {
        Des_Descricao: formData.descricao,
        Des_Valor: formData.valor,
        Des_Data_Vencimento: formData.dataVencimento,
        Des_Parcelado: formData.parcelado,
        Des_Recorrente: false,
        Des_Qtd_Parcelas: formData.numeroParcelas,
        Des_Tipo_Pagamento: formData.formaPagamento,
        Des_Categoria: formData.tipoDespesa
      };

      await axios.put(`/despesas/${selectedConta.des_id}`, data);
      fetchDespesas(); // Atualiza a lista após atualizar
    } catch (error) {
      console.error('Erro ao atualizar despesa:', error);
    }
    handleCloseEditar();
  };

  const handleOpenDarBaixa = (conta) => {
    setSelectedConta(conta);
    setOpenDarBaixa(true);
  };

  const handleCloseDarBaixa = () => setOpenDarBaixa(false);

  const handleDarBaixa = async () => {
    try {
      await axios.put(`/despesas/${selectedConta.des_id}/darbaixa`, {});
      fetchDespesas(); // Atualiza a lista após dar baixa
    } catch (error) {
      console.error('Erro ao dar baixa na despesa:', error);
    }
    handleCloseDarBaixa();
  };
  

  const handleOpenDarBaixaSelecionadas = () => {
    const ids = selectedContasAPagar.map(conta => conta.des_id);

    // Realiza a baixa para cada conta selecionada
    ids.forEach(async (id) => {
      try {
        await axios.put(`/despesas/${id}/darbaixa`);
      } catch (error) {
        console.error(`Erro ao dar baixa na despesa com ID ${id}:`, error);
      }
    });

    fetchDespesas(); // Atualiza a lista após dar baixa nas selecionadas
  };

  const handleCheckboxChange = (event, conta) => {
    if (event.target.checked) {
      setSelectedContasAPagar([...selectedContasAPagar, conta]);
    } else {
      setSelectedContasAPagar(selectedContasAPagar.filter(c => c.des_id !== conta.des_id));
    }
  };

  

  return (
    <Container className="financeiro-container">
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h4">Financeiro</Typography>
        <Box>
          <Button variant="contained" color="primary" onClick={handleOpen}>
            Nova Conta
          </Button>
          <Button
            variant="contained"
            color="secondary"
            sx={{ ml: 2 }}
            onClick={handleOpenDarBaixaSelecionadas}
            disabled={selectedContasAPagar.length === 0}
          >
            Dar Baixa nas Selecionadas
          </Button>
        </Box>
      </Box>
      <Box display="flex" alignItems="center" mb={2}>
        <Box mx={1}>
          <TextField label="Data Inicial" type="date" InputLabelProps={{ shrink: true }} />
        </Box>
        <Box mx={1}>
          <TextField label="Data Final" type="date" InputLabelProps={{ shrink: true }} />
        </Box>
        <Button variant="contained" color="primary" sx={{ ml: 1 }}>Pesquisar</Button>
      </Box>

      <Tabs value={tabValue} onChange={handleTabChange} indicatorColor="primary" textColor="primary">
        <Tab label="Contas a Pagar" />
        <Tab label="Contas Pagas" />
      </Tabs>

      {/* Conteúdo da aba Contas a Pagar */}
      {tabValue === 0 && (
        <>
          <Typography variant="h6" sx={{ mt: 2 }}>Total a Pagar: R${' '}{calcularTotalContas(contasAPagar)}</Typography>
          <TableContainer component={Paper} sx={{ mt: 2 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell></TableCell>
                  <TableCell>Descrição</TableCell>
                  <TableCell>Data</TableCell>
                  <TableCell>Valor</TableCell>
                  <TableCell align="right">Ações</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {contasAPagar.map((conta) => (
                  <TableRow key={conta.des_id}>
                    <TableCell>
                      <Checkbox
                        onChange={(e) => handleCheckboxChange(e, conta)}
                        checked={selectedContasAPagar.some(c => c.des_id === conta.des_id)}
                      />
                    </TableCell>
                    <TableCell>{conta.des_descricao}</TableCell>
                    <TableCell>{conta.des_data_vencimento}</TableCell>
                    <TableCell>{conta.des_valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</TableCell>
                    <TableCell align="right">
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleOpenEditar(conta)}
                      >
                        Editar
                      </Button>
                      <Button
                        variant="contained"
                        color="secondary"
                        onClick={() => handleOpenDarBaixa(conta)}
                        sx={{ ml: 1 }}
                      >
                        Dar Baixa
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}

      {/* Conteúdo da aba Contas Pagas */}
      {tabValue === 1 && (
        <>
          <Typography variant="h6" sx={{ mt: 2 }}>Total Pago: R${' '}{calcularTotalContas(contasPagas)}</Typography>
          <TableContainer component={Paper} sx={{ mt: 2 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Descrição</TableCell>
                  <TableCell>Data de Pagamento</TableCell>
                  <TableCell>Valor</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {contasPagas.map((conta) => (
                  <TableRow key={conta.des_id}>
                    <TableCell>{conta.des_descricao}</TableCell>
                    <TableCell>{conta.des_data_pagamento}</TableCell>
                    <TableCell>{conta.des_valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}

      {/* Modal de Nova Conta */}
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>Nova Conta a Pagar</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Descrição"
                name="descricao"
                value={formData.descricao}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Valor"
                name="valor"
                type="number"
                value={formData.valor}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Data de Vencimento"
                name="dataVencimento"
                type="date"
                InputLabelProps={{ shrink: true }}
                value={formData.dataVencimento}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    name="parcelado"
                    checked={formData.parcelado}
                    onChange={handleChange}
                  />
                }
                label="Parcelado"
              />
            </Grid>
            {formData.parcelado && (
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Número de Parcelas"
                  name="numeroParcelas"
                  type="number"
                  value={formData.numeroParcelas}
                  onChange={handleChange}
                />
              </Grid>
            )}
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Forma de Pagamento</InputLabel>
                <Select
                  name="formaPagamento"
                  label="Forma de Pagamento"
                  value={formData.formaPagamento}
                  onChange={handleChange}
                >
                  <MenuItem value="1">Dinheiro</MenuItem>
                  <MenuItem value="2">Pix</MenuItem>
                  <MenuItem value="3">Débito</MenuItem>
                  <MenuItem value="4">Crédito</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Tipo de Despesa</InputLabel>
                <Select
                  name="tipoDespesa"
                  label="Tipo de Despesa"
                  value={formData.tipoDespesa}
                  onChange={handleChange}
                >
                  <MenuItem value="1">Alimentação</MenuItem>
                  <MenuItem value="2">Transporte</MenuItem>
                  <MenuItem value="3">Moradia</MenuItem>
                  <MenuItem value="4">Outros</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Observação"
                name="observacao"
                value={formData.observacao}
                onChange={handleChange}
                multiline
                rows={3}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">Cancelar</Button>
          <Button onClick={handleSave} color="primary">Salvar</Button>
        </DialogActions>
      </Dialog>

      {/* Modal de Editar Conta */}
      <Dialog open={openEditar} onClose={handleCloseEditar} fullWidth maxWidth="sm">
        <DialogTitle>Editar Conta</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Descrição"
                name="descricao"
                value={formData.descricao}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Valor"
                name="valor"
                type="number"
                value={formData.valor}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Data de Vencimento"
                name="dataVencimento"
                type="date"
                InputLabelProps={{ shrink: true }}
                value={formData.dataVencimento}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    name="parcelado"
                    checked={formData.parcelado}
                    onChange={handleChange}
                  />
                }
                label="Parcelado"
              />
            </Grid>
            {formData.parcelado && (
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Número de Parcelas"
                  name="numeroParcelas"
                  type="number"
                  value={formData.numeroParcelas}
                  onChange={handleChange}
                />
              </Grid>
            )}
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Forma de Pagamento</InputLabel>
                <Select
                  name="formaPagamento"
                  label="Forma de Pagamento"
                  value={formData.formaPagamento}
                  onChange={handleChange}
                >
                  <MenuItem value="1">Dinheiro</MenuItem>
                  <MenuItem value="2">Pix</MenuItem>
                  <MenuItem value="3">Débito</MenuItem>
                  <MenuItem value="4">Crédito</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Tipo de Despesa</InputLabel>
                <Select
                  name="tipoDespesa"
                  label="Tipo de Despesa"
                  value={formData.tipoDespesa}
                  onChange={handleChange}
                >
                  <MenuItem value="1">Alimentação</MenuItem>
                  <MenuItem value="2">Transporte</MenuItem>
                  <MenuItem value="3">Moradia</MenuItem>
                  <MenuItem value="4">Outros</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Observação"
                name="observacao"
                value={formData.observacao}
                onChange={handleChange}
                multiline
                rows={3}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditar} color="secondary">Cancelar</Button>
          <Button onClick={handleUpdate} color="primary">Salvar</Button>
        </DialogActions>
      </Dialog>

      {/* Modal de Dar Baixa */}
      <Dialog open={openDarBaixa} onClose={handleCloseDarBaixa} fullWidth maxWidth="sm">
        <DialogTitle>Dar Baixa na Conta</DialogTitle>
        <DialogContent>
          <Typography>Tem certeza que deseja dar baixa na conta "{selectedConta?.des_descricao}"?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDarBaixa} color="secondary">Cancelar</Button>
          <Button onClick={handleDarBaixa} color="primary">Confirmar</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Financeiro;

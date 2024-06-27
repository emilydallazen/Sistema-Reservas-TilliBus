import React, { useState } from 'react';
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

  const [tabValue, setTabValue] = useState(0);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSave = () => {
    // Lógica para salvar a nova conta a pagar
    console.log('Dados da nova conta:', formData);
    handleClose();
  };

  const contasAPagar = [
    { id: 1, descricao: 'Conta de Luz', data: '2024-06-01', valor: 150.00 },
    { id: 2, descricao: 'Conta de Água', data: '2024-06-05', valor: 80.00 },
    { id: 3, descricao: 'Internet', data: '2024-06-10', valor: 100.00 },
  ];

  const contasPagas = [
    { id: 1, descricao: 'Aluguel', dataVencimento: '2024-05-01', dataBaixa: '2024-05-02', valor: 1200.00 },
    { id: 2, descricao: 'Telefone', dataVencimento: '2024-05-10', dataBaixa: '2024-05-11', valor: 90.00 },
    { id: 3, descricao: 'Internet', dataVencimento: '2024-05-15', dataBaixa: '2024-05-16', valor: 100.00 },
  ];

  const calcularTotalContas = (contas) => {
    return contas.reduce((total, conta) => total + conta.valor, 0).toFixed(2);
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <Container className="financeiro-container">
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h4">Financeiro</Typography>
        <Box>
          <Button variant="contained" color="primary" onClick={handleOpen}>
            Nova Conta
          </Button>
          <Button variant="contained" color="secondary" sx={{ ml: 2 }}>
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
                  <TableCell>
                  </TableCell>
                  <TableCell>Descrição</TableCell>
                  <TableCell>Data</TableCell>
                  <TableCell>Valor</TableCell>
                  <TableCell align="right">Ações</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {contasAPagar.map((conta) => (
                  <TableRow key={conta.id}>
                    <TableCell>
                      <Checkbox />
                    </TableCell>
                    <TableCell>{conta.descricao}</TableCell>
                    <TableCell>{conta.data}</TableCell>
                    <TableCell>{conta.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</TableCell>
                    <TableCell align="right">
                      <Button variant="contained" color="primary" size="small" sx={{ mr: 1 }}>Editar</Button>
                      <Button variant="contained" color="secondary" size="small">Dar Baixa</Button>
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
          <Typography variant="h6" sx={{ mt: 2 }}>Total Pagas: R${' '}{calcularTotalContas(contasPagas)}</Typography>
          <TableContainer component={Paper} sx={{ mt: 2 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Descrição</TableCell>
                  <TableCell>Data de Vencimento</TableCell>
                  <TableCell>Data de Baixa</TableCell>
                  <TableCell>Valor</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {contasPagas.map((conta) => (
                  <TableRow key={conta.id}>
                    <TableCell>{conta.descricao}</TableCell>
                    <TableCell>{conta.dataVencimento}</TableCell>
                    <TableCell>{conta.dataBaixa}</TableCell>
                    <TableCell>{conta.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</TableCell>
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
                  <MenuItem value="dinheiro">Dinheiro</MenuItem>
                  <MenuItem value="pix">Pix</MenuItem>
                  <MenuItem value="debito">Débito</MenuItem>
                  <MenuItem value="credito">Crédito</MenuItem>
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
                  <MenuItem value="alimentacao">Alimentação</MenuItem>
                  <MenuItem value="transporte">Transporte</MenuItem>
                  <MenuItem value="moradia">Moradia</MenuItem>
                  <MenuItem value="outros">Outros</MenuItem>
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
    </Container>
  );
};

export default Financeiro;

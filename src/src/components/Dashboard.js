import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Grid, Paper, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import axios from 'axios';
import './Dashboard.css';

const Dashboard = () => {
  const [totalEntries, setTotalEntries] = useState('R$0,00');
  const [totalExits, setTotalExits] = useState('R$0,00');
  const [totalBalance, setTotalBalance] = useState('R$0,00');
  const [entryDetails, setEntryDetails] = useState([]);
  const [exitDetails, setExitDetails] = useState([]);

  const fetchFinancialData = async () => {
    try {
      const response = await axios.get('/saldo-financas');
      const data = response.data;
      const { total_despesas, total_pagamentos_reservas, saldo_resultante } = data;

      setTotalEntries(`R$${parseFloat(total_pagamentos_reservas).toFixed(2)}`);
      setTotalExits(`R$${parseFloat(total_despesas).toFixed(2)}`);
      setTotalBalance(`R$${parseFloat(saldo_resultante).toFixed(2)}`);
    } catch (error) {
      console.error('Erro:', error);
      // Trate o erro de forma adequada, exibindo uma mensagem para o usuário, por exemplo
    }
  };

  const fetchEntryDetails = async () => {
    try {
      const response = await axios.get('/pagamentos-reserva');
      setEntryDetails(response.data);
    } catch (error) {
      console.error('Erro:', error);
      // Trate o erro de forma adequada, exibindo uma mensagem para o usuário, por exemplo
    }
  };

  const fetchExitDetails = async () => {
    try {
      const response = await axios.get('/saidas-detalhadas');
      setExitDetails(response.data);
    } catch (error) {
      console.error('Erro:', error);
      // Trate o erro de forma adequada, exibindo uma mensagem para o usuário, por exemplo
    }
  };

  useEffect(() => {
    fetchFinancialData();
    fetchEntryDetails();
    fetchExitDetails();
  }, []); // Executa apenas uma vez, ao montar o componente

  return (
    <Container className="dashboard-container">
      <Box className="content">
        <Box component="header" display="flex" justifyContent="center" alignItems="center" borderBottom={1} borderColor="divider" pb={1}>
          <Typography variant="h4">DashBoard Financeiro - 30 dias</Typography>
        </Box>
        <Box className="dashboard">
          <Grid container spacing={2} className="totals">
            <Grid item xs={12} md={4}>
              <Paper className="totalentries">
                <Typography variant="h6">Entradas - Total</Typography>
                <Typography>{totalEntries}</Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper className="totalexits">
                <Typography variant="h6">Saídas - Total</Typography>
                <Typography>{totalExits}</Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper className="totalsaldo">
                <Typography variant="h6">Saldo</Typography>
                <Typography>{totalBalance}</Typography>
              </Paper>
            </Grid>
          </Grid>
          <Grid container spacing={2} mt={4}>
            <Grid item xs={12} md={6}>
              <Paper className="detailsentries-card">
                <Typography variant="h6">Entradas Detalhadas</Typography>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Descrição</TableCell>
                      <TableCell>Valor Total</TableCell>
                      <TableCell>Data de Pagamento</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {entryDetails.map((entry) => (
                      <TableRow key={entry.pre_reserva}>
                        <TableCell>{entry.res_descricao}</TableCell>
                        <TableCell>{`R$${parseFloat(entry.pre_valor_total).toFixed(2)}`}</TableCell>
                        <TableCell>{new Date(entry.pre_data_pagamento).toLocaleDateString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper className="detailsexits-card">
                <Typography variant="h6">Saídas Detalhadas</Typography>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Descrição</TableCell>
                      <TableCell>Valor</TableCell>
                      <TableCell>Data de Pagamento</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {exitDetails.map((exit) => (
                      <TableRow key={exit.des_id}>
                        <TableCell>{exit.des_descricao}</TableCell>
                        <TableCell>{`R$${parseFloat(exit.des_valor).toFixed(2)}`}</TableCell>
                        <TableCell>{exit.des_data_pagamento ? new Date(exit.des_data_pagamento).toLocaleDateString() : 'N/A'}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Paper>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
};

export default Dashboard;

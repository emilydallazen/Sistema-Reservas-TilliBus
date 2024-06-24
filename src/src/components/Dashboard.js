import React from 'react';
import { Container, Typography, Box, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import './Dashboard.css';

const Dashboard = () => {
  return (
    <Container className="dashboard-container">
      <Box className="content">
        <Box component="header" display="flex" justifyContent="center" alignItems="center" borderBottom={1} borderColor="divider" pb={1}>
          <Typography variant="h4">DashBoard Financeiro</Typography>
        </Box>
        <Box className="dashboard">
          <Box className="date-range" display="flex" alignItems="center" my={1}>
            <Box mx={1}>
              <Typography component="label" htmlFor="start-date">Data Inicial: </Typography>
              <input type="date" id="start-date" placeholder="00/00/0000" />
            </Box>
            <Typography component="span">→</Typography>
            <Box mx={1}>
              <Typography component="label" htmlFor="end-date">Data Final: </Typography>
              <input type="date" id="end-date" placeholder="00/00/0000" />
            </Box>
          </Box>
          <Grid container spacing={2} className="totals">
            <Grid item xs={12} md={4}>
              <Paper className="total">
                <Typography variant="h6">Entradas - Total</Typography>
                <Typography>R$0,00</Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper className="total">
                <Typography variant="h6">Saídas - Total</Typography>
                <Typography>R$0,00</Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper className="total">
                <Typography variant="h6">Saldo</Typography>
                <Typography>R$0,00</Typography>
              </Paper>
            </Grid>
          </Grid>
          <Box className="tipos-pagamento" width ="30%"my={2} p={2} borderRadius={2} bgcolor="primary.main" color="primary.contrastText" sx={{ marginLeft: 'left' }}>
            <Typography variant="h6">Tipos de Pagamento</Typography>
            <ul>
              <li>Dinheiro: R$0,00</li>
              <li>Pix: R$0,00</li>
              <li>Cartão de Crédito: R$0,00</li>
              <li>Cartão de Débito: R$0,00</li>
            </ul>
          </Box>
          <Box display="flex" justifyContent="space-between" width="100%">
            <Box className="entries" width="49%">
              <Box className="entry-header" py={1} mb={1} textAlign="center" fontWeight="fontWeightBold" bgcolor="secondary.light" borderRadius={1}>
                Entradas
              </Box>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Descrição</TableCell>
                      <TableCell>Data</TableCell>
                      <TableCell>Valor</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {/* Entradas serão listadas aqui */}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
            <Box className="exits" width="49%">
              <Box className="entry-header" py={1} mb={1} textAlign="center" fontWeight="fontWeightBold" bgcolor="secondary.light" borderRadius={1}>
                Saídas
              </Box>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Descrição</TableCell>
                      <TableCell>Data</TableCell>
                      <TableCell>Valor</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {/* Saídas serão listadas aqui */}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default Dashboard;

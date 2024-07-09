import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import { Container, Box, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ClienteModal from './ClienteModal';
import axios from 'axios';

const Clientes = () => {
  const [clientes, setClientes] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [modalType, setModalType] = useState(1); // 1: Cadastro, 2: Edição
  const [editClient, setEditClient] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [clientToDelete, setClientToDelete] = useState(null);

  useEffect(() => {
    fetchClientes();
  }, []);

  const fetchClientes = async () => {
    try {
      const response = await axios.get('/clientes');
      const data = response.data;
      console.log('Dados dos clientes:', data);
      if (Array.isArray(data)) {
        setClientes(data);
      }
    } catch (error) {
      console.error('Erro ao buscar clientes:', error);
    }
  };

  const handleOpenModal = (client = null, type = 1) => {
    setEditClient(client);
    setModalType(type);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setEditClient(null);
    setModalType(1);
  };

  const handleOpenDeleteDialog = (client) => {
    setClientToDelete(client);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setClientToDelete(null);
  };

  const handleDeleteClient = async () => {
    try {
      await axios.delete(`/clientes/${clientToDelete.cli_id}`);
      setClientes(clientes.filter((client) => client.cli_id !== clientToDelete.cli_id));
      handleCloseDeleteDialog();
    } catch (error) {
      console.error('Erro ao deletar cliente:', error);
    }
  };

  const handleSaveClient = async (client) => {
    try {
      
      if (modalType === 1) {
        // Cadastrar cliente
        await axios.post('/clientes', client);
      } else if (modalType === 2) {
        // Editar cliente
        await axios.put(`/clientes/${editClient.cli_id}`, client);
      }
      fetchClientes();
      handleCloseModal();
    } catch (error) {
      console.error('Erro ao salvar cliente:', error);
    }
  };

  return (
    <div>
      <Navbar />
      <Box display="flex">
        <Sidebar />
        <Container>
          <h1>Clientes</h1>
          <Button variant="contained" color="primary" onClick={() => handleOpenModal(null, 1)}>
            Cadastrar Cliente
          </Button>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Nome</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Celular</TableCell>
                  <TableCell>Ações</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {clientes.map((client) => (
                  <TableRow key={client.cli_id}>
                    <TableCell>{client.cli_nome}</TableCell>
                    <TableCell>{client.cli_email}</TableCell>
                    <TableCell>{client.cli_celular}</TableCell>
                    <TableCell>
                      <IconButton onClick={() => handleOpenModal(client, 2)} color="primary">
                        <EditIcon />
                      </IconButton>
                      <IconButton onClick={() => handleOpenDeleteDialog(client)} color="secondary">
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Modal de Cadastro/Edição */}
          <ClienteModal
            open={openModal}
            onClose={handleCloseModal}
            client={editClient}
            onSave={handleSaveClient}
            tipo={modalType}
          />

          {/* Diálogo de Exclusão */}
          <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
            <DialogTitle>Excluir Cliente</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Você tem certeza que deseja excluir o cliente {clientToDelete?.cli_nome}?
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDeleteDialog} color="primary">
                Cancelar
              </Button>
              <Button onClick={handleDeleteClient} color="secondary">
                Excluir
              </Button>
            </DialogActions>
          </Dialog>
        </Container>
      </Box>
    </div>
  );
};

export default Clientes;

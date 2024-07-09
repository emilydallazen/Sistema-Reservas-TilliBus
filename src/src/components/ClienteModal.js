import React, { useState, useEffect } from 'react';
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';

const ClienteModal = ({ open, onClose, client, onSave, tipo }) => {
  const [clienteData, setClienteData] = useState({
    cli_nome: '',
    cli_cpf: '',
    cli_celular: '',
    cli_email: '',
    cli_data_nascimento: '',
    cli_estado: '',
    cli_cidade: '',
    cli_logradouro: '',
    cli_numero: '',
    cli_complemento: ''
  });

  useEffect(() => {
    if (client) {
      setClienteData(client);
    }
  }, [client]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setClienteData({ ...clienteData, [name]: value });
  };

  const handleClienteSubmit = () => {
    onSave(clienteData);
    handleClose();
  };

  const handleClose = () => {
    setClienteData({
      cli_nome: '',
      cli_cpf: '',
      cli_celular: '',
      cli_email: '',
      cli_data_nascimento: '',
      cli_estado: '',
      cli_cidade: '',
      cli_logradouro: '',
      cli_numero: '',
      cli_complemento: ''
    });
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>{tipo === 1 ? 'Cadastrar Cliente' : 'Editar Cliente'}</DialogTitle>
      <DialogContent>
        <TextField
          fullWidth
          required
          label="Nome"
          name="cli_nome"
          value={clienteData.cli_nome}
          onChange={handleInputChange}
          sx={{ marginBottom: '10px' }}
        />
        <TextField
          fullWidth
          required
          label="CPF"
          name="cli_cpf"
          value={clienteData.cli_cpf}
          onChange={handleInputChange}
          sx={{ marginBottom: '10px' }}
        />
        <TextField
          fullWidth
          required
          label="Telefone"
          name="cli_celular"
          value={clienteData.cli_celular}
          onChange={handleInputChange}
          sx={{ marginBottom: '10px' }}
        />
        <TextField
          fullWidth
          label="E-mail"
          name="cli_email"
          value={clienteData.cli_email}
          onChange={handleInputChange}
          sx={{ marginBottom: '10px' }}
        />
        <TextField
          fullWidth
          label="Data de Nascimento"
          type="date"
          name="cli_data_nascimento"
          value={clienteData.cli_data_nascimento}
          onChange={handleInputChange}
          InputLabelProps={{ shrink: true }}
          sx={{ marginBottom: '10px' }}
        />
        <TextField
          fullWidth
          required
          label="Cidade"
          name="cli_cidade"
          value={clienteData.cli_cidade}
          onChange={handleInputChange}
          sx={{ marginBottom: '10px' }}
        />
        <TextField
          fullWidth
          required
          label="Estado"
          name="cli_estado"
          value={clienteData.cli_estado}
          onChange={handleInputChange}
          sx={{ marginBottom: '10px' }}
        />
        <TextField
          fullWidth
          label="Logradouro"
          name="cli_logradouro"
          value={clienteData.cli_logradouro}
          onChange={handleInputChange}
          sx={{ marginBottom: '10px' }}
        />
        <TextField
          fullWidth
          label="Número"
          name="cli_numero"
          value={clienteData.cli_numero}
          onChange={handleInputChange}
          sx={{ marginBottom: '10px' }}
        />
        <TextField
          fullWidth
          label="Complemento"
          name="cli_complemento"
          value={clienteData.cli_complemento}
          onChange={handleInputChange}
          sx={{ marginBottom: '10px' }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="secondary">Cancelar</Button>
        <Button onClick={handleClienteSubmit} color="primary">Salvar Cliente</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ClienteModal;

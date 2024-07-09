import React from 'react';
import { useParams } from 'react-router-dom';

function EditarDespesa() {
  const { id } = useParams();

  return (
    <div>
      <h2>Editar Despesa</h2>
      <p>Editar a despesa com ID: {id}</p>
      {/* Adicione o formulário de edição aqui */}
    </div>
  );
}

export default EditarDespesa;

import React from 'react';
import { useParams } from 'react-router-dom';

function DarBaixaDespesa() {
  const { id } = useParams();

  return (
    <div>
      <h2>Dar Baixa na Despesa</h2>
      <p>Dar baixa na despesa com ID: {id}</p>
      {/* Adicione a lógica para dar baixa na despesa aqui */}
    </div>
  );
}

export default DarBaixaDespesa;

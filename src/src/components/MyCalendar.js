// src/components/MyCalendar.js
import React from 'react';
import FullCalendar from '@fullcalendar/react'; // Importa o componente principal
import dayGridPlugin from '@fullcalendar/daygrid'; // Importa o plugin para a visualização mensal
import timeGridPlugin from '@fullcalendar/timegrid'; // Importa o plugin para a visualização semanal
import interactionPlugin from '@fullcalendar/interaction'; // Importa o plugin para interação (como clicar e arrastar eventos)
import allLocales from '@fullcalendar/core/locales-all'; // Importa todos os locais

const MyCalendar = () => {
  return (
    <FullCalendar
      plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
      initialView="dayGridMonth" // Define a visualização inicial como mensal
      locales={allLocales} // Adiciona suporte para todos os idiomas
      locale="pt-br" // Define o idioma como português do Brasil
      headerToolbar={{ // Configura o cabeçalho do calendário
        left: 'prev,next today',
        center: 'title',
        right: 'dayGridMonth,timeGridWeek,timeGridDay'
      }}
      events={[ // Exemplo de eventos estáticos
        { title: 'Evento 1', date: '2024-06-20' },
        { title: 'Evento 2', date: '2024-06-22' }
      ]}
    />
  );
};

export default MyCalendar;



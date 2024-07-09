import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import axios from 'axios';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

const Grafico = () => {
    const [dadosReservas, setDadosReservas] = useState(null);

    useEffect(() => {
        fetchReservasPorMes();
    }, []);

    const fetchReservasPorMes = async () => {
        try {
            const response = await axios.get('/reservas-por-mes');
            const data = response.data;

            console.log('Dados retornados:', data); // Verifique o que está sendo retornado pela API

            // Montar dados para todos os meses do ano
            const labels = Array.from({ length: 12 }, (_, index) => obterNomeMes(index + 1));
            const valores = Array.from({ length: 12 }, () => 0);

            // Preencher valores reais das reservas por mês
            data.forEach(item => {
                const mesIndex = parseInt(item.mes, 10) - 1;
                valores[mesIndex] = parseInt(item.quantidade, 10);
            });

            const novoDados = {
                labels: labels,
                datasets: [{
                    label: 'Reservas Finalizadas por Mês',
                    data: valores,
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                        'rgba(153, 102, 255, 0.2)',
                        'rgba(255, 159, 64, 0.2)',
                        'rgba(255, 205, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(153, 102, 255, 0.2)',
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(255, 159, 64, 0.2)'
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                        'rgba(255, 159, 64, 1)',
                        'rgba(255, 205, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(153, 102, 255, 1)',
                        'rgba(255, 99, 132, 1)',
                        'rgba(255, 159, 64, 1)'
                    ],
                    borderWidth: 1
                }]
            };

            setDadosReservas(novoDados);
        } catch (error) {
            console.error('Erro ao buscar reservas por mês:', error);
        }
    };

    const obterNomeMes = (numeroMes) => {
        const meses = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
                       'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
        return meses[numeroMes - 1] || ''; // Retorna string vazia se o mês não existir
    };

    const options = {
        scales: {
            y: {
                beginAtZero: true
            }
        }
    };

    return (
        <div>
            {dadosReservas ? (
                <Bar data={dadosReservas} options={options} />
            ) : (
                <p>Carregando...</p>
            )}
        </div>
    );
};

export default Grafico;

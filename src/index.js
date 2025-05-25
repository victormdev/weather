require('dotenv').config({ path: './.env' });

const express = require('express');
const axios = require('axios');

const app = express();

const port = process.env.PORT || 3000;

const API_KEY = process.env.API_KEY;

const BASE_URL = 'http://my.meteoblue.com/packages/basic-day';


app.use(express.json());


/**
 * @route GET /api/temperatura
 * @description Retorna a temperatura do dia ou de vários dias para a localização informada.
 * @queryparam {number} latitude - Latitude da localização (obrigatório).
 * @queryparam {number} longitude - Longitude da localização (obrigatório).
 * @queryparam {number} [days=3] - Número de dias para obter a previsão (opcional), como o evento vai durar 3 dias, usaremos 3.
 */

app.get('/api/temperatura', async (req, res) => {
    // Extrai latitude, longitude e número de dias dos parâmetros de consulta
    const { latitude, longitude, days } = req.query;

    if (!latitude || !longitude) {
        return res.status(400).json({ error: 'Latitude e longitude são obrigatórias.' });
    }

    const numberOfDays = days ? parseInt(days) : 1;

    // Verifica se a chave da API está configurada
    if (!API_KEY) {
        console.error('Erro: Chave da API da Meteoblue não configurada. Verifique seu arquivo .env.');
        return res.status(500).json({ error: 'Chave da API não configurada no servidor.' });
    }

    // Configura os parâmetros para a requisição
    const params = {
        lat: latitude,
        lon: longitude,
        variables: ['temperature_max', 'temperature_min', 'temperature'],
        apikey: API_KEY,
        unit: 'metric',
        format: 'json',
    };

    try {
        const response = await axios.get(BASE_URL, { params });
        const meteoblueData = response.data;

        if (!meteoblueData || !meteoblueData.data_day || !meteoblueData.data_day.time) {
            console.error('Estrutura de dados da Meteoblue inesperada:', JSON.stringify(meteoblueData, null, 2));
            return res.status(500).json({ error: 'Dados da Meteoblue indisponíveis ou em formato inesperado.' });
        }

        // Processa os dados para extrair as temperaturas dos dias solicitados
        const temperatures = [];

        for (let i = 0; i < Math.min(numberOfDays, meteoblueData.data_day.time.length); i++) {
            temperatures.push({
                date: meteoblueData.data_day.time[i],
                temperature: meteoblueData.data_day.temperature ? meteoblueData.data_day.temperature[i] : null,
                temperature_min: meteoblueData.data_day.temperature_min ? meteoblueData.data_day.temperature_min[i] : null,
                temperature_max: meteoblueData.data_day.temperature_max ? meteoblueData.data_day.temperature_max[i] : null,
            });
        }

        // Envia a resposta JSON com os dados de temperatura
        res.json({
            message: `Temperatura para ${numberOfDays} dia(s) em latitude ${latitude}, longitude ${longitude}`,
            location: {
                latitude: parseFloat(latitude),
                longitude: parseFloat(longitude)
            },
            unit: 'Celsius', 
            data: temperatures
        });

    } catch (error) {
        console.error('Erro ao chamar a API:', error.message);

        if (error.response) {
            console.error('Status da resposta da Meteoblue:', error.response.status);
            console.error('Dados do erro da Meteoblue:', error.response.data);
            res.status(error.response.status).json({
                error: 'Erro ao obter dados da Meteoblue',
                details: error.response.data
            });
        } else if (error.request) {
            res.status(500).json({ error: 'Nenhuma resposta recebida da API da Meteoblue. Verifique sua conexão ou cheque a disponibilidade da API.' });
        } else {
            res.status(500).json({ error: 'Erro interno ao configurar a requisição para a API da Meteoblue.' });
        }
    }
});


// Inicia o servidor
app.listen(port, () => {
    console.log(`Servidor intermediário rodando em http://localhost:${port}`);
    console.log('Para testar, use:');
    console.log(`GET http://localhost:${port}/api/temperatura?latitude=-23.5505&longitude=-46.6333&days=3`);
    console.log('Substitua latitude e longitude pelos valores desejados.');
});
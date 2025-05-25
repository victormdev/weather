# API de temperatura

Este projeto implementa uma API intermediária em Node.js para consultar dados de temperatura utilizando a API da Meteoblue. Ele serve como uma camada entre o chatbot no Blip (ou qualquer cliente) e a API externa, gerenciando chaves de API e simplificando as requisições.

---

## Funcionalidades

* **Consulta diária:** Obtenha a temperatura (máxima, mínima e média) para um número de dias atuais ou futuros.
* **Gerenciamento da key:** Nossa chave da Meteoblue é armazenada em um arquivo `.env`, garantindo que ela não seja exposta no código.
* **API simples:** Interface REST simples para facilitar a integração.

---

## Tecnologias utilizadas

* **Node.js:** Ambiente de execução JavaScript.
* **Express.js:** Framework Node.js pra construir a API RESTful.
* **Axios:** Cliente HTTP baseado em Promises, para fazer requisições na API da Meteoblue.
* **Dotenv:** Para carregar variáveis de ambiente de um arquivo `.env`.

---

## Requisitos

Antes de começar, certifique de ter instalado:

* **Node.js**
* Uma **chave de API da Meteoblue**. Você pode obter fazendo o cadastro no site da [Meteoblue](https://docs.meteoblue.com/en/weather-apis/forecast-api/overview).

---

## Como rodar o projeto

Siga estes passos para configurar e iniciar sua API:


1.  **Crie o arquivo `.env`:**
    Na **raiz do seu projeto**, crie um arquivo chamado `.env` e adicione a chave de API da Meteoblue:

    ```env
    API_KEY=SUA_CHAVE_AQUI
    ```
    **Substitua `SUA_CHAVE_AQUI` pela sua chave real. Enviarei a chave real por e-mail.**

2.  **Instale as dependências:**
    Na **raiz do seu projeto**, abra o terminal e execute:

    ```bash
    npm install
    ```
    Isso instalará todas as bibliotecas listadas no `package.json` (`express`, `axios`, `dotenv`).

6.  **Rode a API:**
    Com as dependências instaladas, você pode iniciar o servidor na **raiz do seu projeto** executando:

    ```bash
    npm start
    ```
    Você deverá ver uma mensagem no terminal indicando que o servidor está rodando, como `Aplicação rodando em http://localhost:3000`.

---

## Como usar

A API estará disponível em `http://localhost:3000` (ou na porta configurada).

### Endpoint: `/api/temperatura` (GET)

Este endpoint permite consultar a temperatura para uma localização e período específicos.


#### Exemplos:

1.  **Previsão para o dia atual (padrão):**
    ```
    GET http://localhost:3000/api/temperatura?latitude=-12.9711&longitude=-38.5108
    ```

2.  **Previsão para os próximos 3 dias (quantidade de dias do evento):**
    ```
    GET http://localhost:3000/api/temperatura?latitude=-12.9711&longitude=-38.5108&days=3
    ```

---
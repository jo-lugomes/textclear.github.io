const express = require('express');
const path = require('path');


var Parse = require('parse/node');

// Inicialize o Parse com suas credenciais
Parse.initialize("Zu4KHqyxVhVxJ5KAkORkkC2MhKD5nyliQvWAsIfV", "1uV1NtEU6O7GGwHy8h23S8bL4JwXzUHLD53b0RiO");  // Substitua pelas suas credenciais
Parse.serverURL = 'https://parseapi.back4app.com/';

const app = express();
const PORT = process.env.PORT || 5500;

// Definindo o diretório onde está o arquivo HTML
const publicDirectoryPath = path.join(__dirname, '');

// Servindo arquivos estáticos (como o chat.html) usando o Express
app.use(express.static(publicDirectoryPath));
// Middleware para analisar o corpo da solicitação como JSON
app.use(express.json());

const {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} = require("@google/generative-ai");

const MODEL_NAME = "gemini-1.0-pro";
const API_KEY = "AIzaSyBvdjX5dZ-nTUTj-CIGl5vxoeAhg_F-6tU";

//API 1 
// Rota para enviar JSON
app.post('/enviar-json', async (req, res) => {
  const valor = req.body.valor;
  
  //função da API.
  async function runChat() {
    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });
  
    const generationConfig = {
      temperature: 0.9,
      topK: 1,
      topP: 1,
      maxOutputTokens: 2048,
    };
  
    const safetySettings = [
      {
        category: HarmCategory.HARM_CATEGORY_HARASSMENT,
        threshold: HarmBlockThreshold.BLOCK_NONE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
        threshold: HarmBlockThreshold.BLOCK_NONE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
        threshold: HarmBlockThreshold.BLOCK_NONE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
        threshold: HarmBlockThreshold.BLOCK_NONE,
      },
    ];
  
    const chat = model.startChat({
      generationConfig,
      safetySettings,
      history: [
        {
          role: "user",
          parts: [{ text: "Your task is to correct grammatical errors in Portuguese sentences such as initial capital letters. Never say anything other than the corrected text. If the user sends something in another language, send an error message. And if the user sends anything other than sentences for correction, send an error message."}],
        },
        {
          role: "model",
          parts: [{ text: "Okay"}],
        },
      ],
    });
  
    const result = await chat.sendMessage(valor);
    const response = result.response;
    console.log(response.text());
    return response.text();
  }

  try {
    // Chamando a função e aguardando a resposta
    const resposta = await runChat();
    // Enviando a resposta em JSON para o cliente
    res.json({ resposta });
  } catch (error) {
    console.error("Erro:", error);
    // Enviando uma resposta de erro em caso de falha
    res.status(500).json({ erro: "Ocorreu um erro ao processar a solicitação." });
  }

});

//API 2 
app.post('/enviar2-json', async (req, res) => {
  const valor = req.body.valor;
  
  //função da API.
  async function runChat() {
    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });
  
    const generationConfig = {
      temperature: 0.9,
      topK: 1,
      topP: 1,
      maxOutputTokens: 2048,
    };
  
    const safetySettings = [
      {
        category: HarmCategory.HARM_CATEGORY_HARASSMENT,
        threshold: HarmBlockThreshold.BLOCK_NONE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
        threshold: HarmBlockThreshold.BLOCK_NONE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
        threshold: HarmBlockThreshold.BLOCK_NONE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
        threshold: HarmBlockThreshold.BLOCK_NONE,
      },
    ];
  
    const chat = model.startChat({
      generationConfig,
      safetySettings,
      history: [
        {
          role: "user",
          parts: [{ text: "Sua tarefa é resumir textos em português se for realizar uma lista utilize numeros ao inves de asteristicos, se o usuário mandar algo em outra lingua, mande um mensagem de erro. Se o usuário mandar qualquer coisa além de uma frase ou texto em português, de uma mensagem de erro."}],
        },
        {
          role: "model",
          parts: [{ text: "Okay"}],
        },
      ],
    });
  
    const result = await chat.sendMessage(valor);
    const response = result.response;
    console.log(response.text());
    return response.text();
  }

  try {
    // Chamando a função e aguardando a resposta
    const resposta = await runChat();
    // Enviando a resposta em JSON para o cliente
    res.json({ resposta });
  } catch (error) {
    console.error("Erro:", error);
    // Enviando uma resposta de erro em caso de falha
    res.status(500).json({ erro: "Ocorreu um erro ao processar a solicitação." });
  }

});

// Iniciando o servidor na porta especificada
app.listen(PORT, () => {
  console.log(`Servidor está rodando na porta ${PORT}`);
});

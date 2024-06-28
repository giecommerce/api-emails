const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(bodyParser.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));

// Rota de verificação de status
app.get('/', (req, res) => {
  res.send('Servidor está funcionando corretamente!');
});

// Nodemailer transport
const transport = nodemailer.createTransport({
  host: 'smtp.zoho.com',
  port: 465,
  secure: true, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER, // seu email do Zoho
    pass: process.env.EMAIL_PASS, // sua senha do Zoho
  },
  tls: {
    rejectUnauthorized: false,
  },
});

app.post('/send', (req, res) => {
  const { name, email, message, recipient } = req.body;

  const mailOptions = {
    from: process.env.EMAIL_USER, // seu email do Zoho
    to: recipient, // destinatário dinâmico baseado na entrada do frontend
    replyTo: email, // responder para o email fornecido pelo cliente
    subject: `Nova mensagem de contato: ${name} - ${email}`, // Nome e email do cliente no assunto
    text: `${message}\n\nAtt,\n${name}\n${email}`, // Mensagem e assinatura do cliente
  };

  transport.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error); // Captura o erro e mostra no console
      return res.status(500).json({ error: `Falha ao enviar a mensagem. Tente novamente mais tarde. Erro: ${error.message}` });
    }
    res.status(200).send('Mensagem enviada com sucesso!');
  });
});

app.listen(port, () => {
  console.log(`Servidor está rodando na porta: ${port}`);
});
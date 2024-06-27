const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));

const transport = nodemailer.createTransport({
  host: 'smtp.zoho.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER, 
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

app.post('/send', (req, res) => {
  const { name, email, message, recipient } = req.body;

  const mailOptions = {
    from: process.env.EMAIL_USER, 
    to: recipient, 
    replyTo: email, 
    subject: `Nova mensagem de contato: ${name} - ${email}`,
    text: `${message}\n\nAtt,\n${name}\n${email}`, 
  };

  transport.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
      return res.status(500).send('Falha ao enviar a mensagem. Tente novamente mais tarde.');
    }
    res.status(200).send('Mensagem enviada com sucesso!');
  });
});

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});

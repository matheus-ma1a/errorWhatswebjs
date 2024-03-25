const express = require('express');
const bodyParser = require('body-parser');
const { Client, LocalAuth, MessageMedia } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

const app = express();
const PORT = 3050;

const client = new Client({
  puppeteer: {
    // executablePath: '/usr/bin/google-chrome-stable',
    headless: true,
    args: ['--no-sandbox'],
  },
  authStrategy: new LocalAuth({
    clientId: 'TestClient'
  })
});

client.on('qr', qr => {
  qrcode.generate(qr, { small: true });
});

client.on('authenticated', () => {
  console.log('Autenticado');
});

client.on('auth_failure', function () {
  console.error('Falha na autenticação');
});

client.on('ready', () => {
  console.log('Cliente pronto!');
});

client.initialize();

app.use(bodyParser.json());

app.post('/webhook', async (req, res) => {
  let numero = req.body.data.phone_number;
  let ddd = req.body.data.phone_local_code;
  let email = req.body.data.email;
  let nome = req.body.data.full_name;

  
  console.log(await client.getWWebVersion());


  // Verifica se o número já possui 8 dígitos
  let novoNumero;
  if (numero.length === 8) {
    novoNumero = numero;
  } else {
    novoNumero = numero.slice(1);
  }

  console.log('Dados recebidos:', ddd, novoNumero);

  // Aqui você deve adicionar a lógica para enviar a mensagem para o número de telefone fornecido
  const canal = `55${ddd}${novoNumero}@c.us`; // Canal de exemplo

  console.log(canal, typeof (canal))

  const video = MessageMedia.fromFilePath('./Vídeott.mp4');

  client.sendMessage(canal, video, {
    caption: `
  Fala ${nome}, vc ja está dentro da comunidade no WhatsApp?
  
  Comunidade Tt - iGaming
  
  Acesse o curso:
  email: ${email}
  senha: 123456
  
  www.comunidadett.com 
  
  Cadastre-se (60%rev ou 50cpa e 40%rev)
  www.comunidadeTt.com/seubet 
    `});


  res.status(200).send('Mensagem enviada com sucesso');
});


app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const schedule = require('node-schedule');
const puppeteer = require('puppeteer');
const fetchLabs = require('./fetchlabs');

// Nome do grupo autorizado
const GROUP_NAME = 'Me Myself and I';

const client = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: {
    headless: 'new',
    executablePath: puppeteer.executablePath(),
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  }
});

client.on('qr', qr => {
  qrcode.generate(qr, { small: true });
});

client.on('ready', async () => {
  console.log('✅ Bot pronto!');

  // Aguarde 5 segundos para garantir que os chats carregaram
  setTimeout(async () => {
    try {
      const chats = await client.getChats();
      const group = chats.find(chat => chat.isGroup && chat.name === GROUP_NAME);

      if (!group) {
        console.log(`❌ Grupo "${GROUP_NAME}" não encontrado.`);
        return;
      }

      console.log(`✅ Grupo "${GROUP_NAME}" encontrado.`);

      // Agendamento diário às 10:00
      schedule.scheduleJob('0 10 * * *', async () => {
        const msg = await fetchLabs();
        client.sendMessage(group.id._serialized, msg);
        console.log(`📤 Mensagem enviada automaticamente para ${GROUP_NAME} às 10h.`);
      });
    } catch (err) {
      console.error('Erro ao configurar o grupo ou agendamento:', err);
    }
  }, 5000);
});

// Escuta mensagens
client.on('message', async message => {
  try {
    const chat = await message.getChat();

    if (
      message.body.toLowerCase() === '/laboratorio' &&
      chat.isGroup &&
      chat.name === GROUP_NAME
    ) {
      const msg = await fetchLabs();
      client.sendMessage(chat.id._serialized, msg);
    }
  } catch (err) {
    console.error('Erro ao processar mensagem:', err);
  }
});

client.initialize();
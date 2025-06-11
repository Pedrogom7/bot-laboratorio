
# 🤖 Bot de Laboratórios - Unicesumar

Este é um bot do WhatsApp feito com [whatsapp-web.js](https://github.com/pedroslopez/whatsapp-web.js), que envia diariamente as informações dos laboratórios da Unicesumar para o grupo da sua sala e também responde ao comando `/laboratorio` enviado no grupo.

## 🚀 Funcionalidades

- ✅ Responde ao comando `/laboratorio` com a lista dos laboratórios do dia.
- ⏰ Envia automaticamente a lista de laboratórios todos os dias às 10:00 da manhã.
- 🔒 Restringe o comando e agendamento para um grupo específico (identificado por nome).
- 🧼 Projeto leve, simples e funcional.

## 📁 Estrutura de Arquivos

```
bot-lab-unicesumar/
├── bot.js               # Código principal do bot
├── fetchlabs.js         # Função que faz o scraping da Unicesumar
├── package.json
└── tokens/              # Diretório criado automaticamente com os dados de autenticação
```

## 🛠️ Tecnologias

- [Node.js](https://nodejs.org/)
- [whatsapp-web.js](https://github.com/pedroslopez/whatsapp-web.js)
- [puppeteer-core](https://pptr.dev/)
- [qrcode-terminal](https://www.npmjs.com/package/qrcode-terminal)
- [node-cron](https://www.npmjs.com/package/node-cron)

## 📦 Instalação

1. Clone o repositório:

```bash
git clone https://github.com/Pedrogom7/bot-laboratorio
cd bot-laboratório
```

2. Instale as dependências:

```bash
npm install
```

3. Execute o bot:

```bash
node bot.js
```

## 🔑 Primeira Execução

Na primeira vez que o bot for executado, será gerado um QR Code no terminal. Escaneie com o WhatsApp Web usando o celular para autenticar.

## ⚙️ Configuração

O bot está programado para enviar mensagens apenas para um grupo específico. Ele identifica o grupo pelo **nome**, então certifique-se de que o nome exato do grupo está especificado corretamente no código (`groupName` em `bot.js`).

Se quiser trocar o horário da mensagem automática, edite a expressão cron no `bot.js`:

```js
cron.schedule('0 10 * * *', async () => {
  // envia a mensagem todo dia às 10:00
});
```

## ☁️ Hospedagem

Para manter o bot online 24/7, você pode usar:

- **VPS (Recomendado)**: Contabo, DigitalOcean, etc.
- **AWS EC2 Free Tier**: gratuito por 12 meses.
- **Railway / Render / Fly.io**: com limitações no plano gratuito.
- **Raspberry Pi**: se quiser rodar localmente 24h.

## 📄 Licença

Este projeto está licenciado sob a Licença MIT - veja o arquivo [LICENSE](LICENSE) para detalhes.


## 👤 Autor

Desenvolvido por Pedro Gomes, estudante de Engenharia de Software na Unicesumar, com foco em automações e integração de serviços usando JavaScript e Node.js. Para sugestões, melhorias ou colaborações, sinta-se à vontade para entrar em contato.
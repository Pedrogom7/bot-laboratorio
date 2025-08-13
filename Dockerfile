# Dockerfile
FROM ghcr.io/puppeteer/puppeteer:22.15.0

WORKDIR /app

COPY package*.json ./
# instala prod deps (o Puppeteer da base já vem preparado)
RUN npm ci --omit=dev

COPY . .

ENV NODE_ENV=production
# importante p/ agendamento no horário do Brasil
ENV TZ=America/Sao_Paulo

# starta o bot
CMD ["node", "bot.js"]
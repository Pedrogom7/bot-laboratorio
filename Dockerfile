# Usa imagem oficial do Puppeteer que já vem com Chrome e deps
FROM ghcr.io/puppeteer/puppeteer:latest

# Define diretório de trabalho
WORKDIR /app

# Copia apenas arquivos de dependências primeiro (melhora cache do Docker)
COPY package*.json ./

# Instala dependências sem as de desenvolvimento
# --no-audit e --no-fund evitam requests extras que atrasam build
RUN npm install --omit=dev --no-audit --no-fund

# Copia o restante do código
COPY . .

# Configura ambiente
ENV NODE_ENV=production
ENV TZ=America/Sao_Paulo

# Comando padrão
CMD ["node", "bot.js"]
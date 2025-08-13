# Stage 1: Install dependencies
FROM node:18-slim AS deps

# Install minimal Chromium dependencies
RUN apt-get update && apt-get install -y \
  chromium \
  fonts-liberation \
  libasound2 \
  libatk-bridge2.0-0 \
  libatk1.0-0 \
  libcups2 \
  libgbm1 \
  libnspr4 \
  libnss3 \
  libxcomposite1 \
  libxdamage1 \
  libxrandr2 \
  xdg-utils \
  --no-install-recommends \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY package*.json ./
# Optimize npm install
RUN npm install --no-audit --no-fund --prefer-offline --omit=dev

# Stage 2: Final image
FROM node:18-slim

# Copy Chromium and dependencies from deps stage
COPY --from=deps /usr/bin/chromium /usr/bin/chromium
COPY --from=deps /usr/lib /usr/lib
COPY --from=deps /usr/share /usr/share

# Set working directory
WORKDIR /app

# Copy node_modules from deps stage
COPY --from=deps /app/node_modules ./node_modules

# Copy application code
COPY . .

# Set Puppeteer to use system Chromium
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true

# Start the bot
CMD ["node", "bot.js"]
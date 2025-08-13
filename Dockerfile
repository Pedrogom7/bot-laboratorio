# Stage 1: Install dependencies
FROM node:18-alpine AS deps

# Install Chromium and minimal dependencies
RUN apk add --no-cache \
  chromium \
  nss \
  freetype \
  freetype-dev \
  harfbuzz \
  ca-certificates \
  ttf-freefont \
  nodejs \
  npm

WORKDIR /app
COPY package*.json ./
# Install production dependencies only
RUN npm install --no-audit --no-fund --prefer-offline --omit=dev

# Stage 2: Final image
FROM node:18-alpine

# Install runtime dependencies for Chromium
RUN apk add --no-cache \
  chromium \
  nss \
  freetype \
  harfbuzz \
  ca-certificates \
  ttf-freefont

# Set working directory
WORKDIR /app

# Copy node_modules from deps stage
COPY --from=deps /app/node_modules ./node_modules

# Copy application code
COPY . .

# Set Puppeteer to use system Chromium
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true

# Start the bot
CMD ["node", "bot.js"]
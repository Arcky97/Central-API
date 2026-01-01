# ---------- Build stage ----------
FROM node:20-alpine AS builder

WORKDIR /usr/app

# Install dependencies
COPY package*.json ./
RUN npm install 

# Copy source
COPY . .

# Build Typescript
RUN npm run build 

# Expose API port
EXPOSE 3012

CMD ["node", "dist/server.js"]
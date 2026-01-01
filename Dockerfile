# ---------- Build stage ----------
FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install 

# Copy source
COPY . .

# Build Typescript
RUN npm run build 


# ---------- Runtime stage ----------
FROM node:20-alpine

WORKDIR /app 

# Only copy what we need to run
COPY package*.json ./
RUN npm install --omit=dev

COPY --from=builder /app/dist ./dist /app/
# Optional but recommended
ENV NODE_ENV=production

# Expose API port
EXPOSE 3000

CMD ["node", "dist/server.js"]
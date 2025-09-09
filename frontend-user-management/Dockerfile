# Builder image
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Copy Prisma schema early
COPY prisma ./prisma/

# Install dependencies
RUN npm ci

# Copy remaining source code
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Build Next.js app
RUN npm run build

# Runner image
FROM node:18-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

# Copy required files from builder
COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/prisma ./prisma

EXPOSE 3000

# Start Next.js app
CMD ["npm", "start"]

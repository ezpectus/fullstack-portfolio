FROM node:20-alpine AS builder
WORKDIR /app/backend
COPY backend/package.json backend/package-lock.json* ./
RUN npm ci || npm install
COPY backend/ ./
RUN npx prisma generate
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/backend/dist ./dist
COPY --from=builder /app/backend/node_modules ./node_modules
COPY --from=builder /app/backend/package.json ./
COPY --from=builder /app/backend/prisma ./prisma
EXPOSE 4000
CMD ["node", "dist/app.js"]

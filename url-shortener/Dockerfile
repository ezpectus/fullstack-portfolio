# ─── Build stage ───
FROM node:20-alpine AS builder

WORKDIR /app

COPY backend/package.json backend/package-lock.json* ./backend/

RUN cd backend && npm ci

COPY backend/ ./backend/

RUN cd backend && npm run build

# ─── Development stage ───
FROM node:20-alpine AS development

WORKDIR /app

COPY --from=builder /app ./

EXPOSE 4000

CMD ["cd", "backend", "&&", "npm", "run", "dev"]

# ─── Production stage ───
FROM node:20-alpine AS production

WORKDIR /app

ENV NODE_ENV=production

COPY --from=builder /app/backend/dist ./backend/dist
COPY --from=builder /app/backend/prisma ./backend/prisma
COPY --from=builder /app/backend/package.json ./backend/

RUN cd backend && npm ci --omit=dev && npx prisma generate

EXPOSE 4000

CMD ["node", "backend/dist/app.js"]

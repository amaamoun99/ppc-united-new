# syntax=docker/dockerfile:1
# --- Build stage ---
FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies (use ci for reproducible builds)
COPY package.json package-lock.json* ./
RUN npm ci

# Prisma generate (needed for standalone bundle)
COPY prisma ./prisma/
RUN npx prisma generate

# Build app
COPY . .
RUN npm run build

# --- Run stage ---
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy standalone output (includes minimal node_modules + server)
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

# Prisma schema + generated client for runtime (migrations / introspection if needed)
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma

USER nextjs

EXPOSE 3000
CMD ["node", "server.js"]

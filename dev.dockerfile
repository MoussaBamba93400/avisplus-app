# syntax=docker/dockerfile:1.7

# --- Stage 1: install deps ----------------------------------------------------------
    FROM node:22-alpine AS deps
    WORKDIR /app
    COPY package.json package-lock.json* ./
    # --ignore-scripts skips nuxt prepare (postinstall), which needs source files not
    # present at this stage. The `build` stage runs nuxt build (which re-prepares) later.
    RUN npm ci --no-audit --no-fund --legacy-peer-deps --ignore-scripts
    
    # --- Stage 2a: dev server (used by docker-compose for hot-reload) -------------------
    FROM node:22-alpine AS dev
    WORKDIR /app
    ENV NODE_ENV=development \
        HOST=0.0.0.0 \
        PORT=3000 \
        CHOKIDAR_USEPOLLING=true \
        CHOKIDAR_INTERVAL=500 \
        WATCHPACK_POLLING=true
    COPY --from=deps /app/node_modules ./node_modules
    COPY . .
    EXPOSE 3000 24678
    CMD ["npx", "nuxt", "dev", "--host", "0.0.0.0", "--port", "3000"]
    
    # --- Stage 2b: build Nuxt for production ---------------------------------------------
    FROM node:22-alpine AS build
    WORKDIR /app
    ENV NODE_ENV=production
    COPY --from=deps /app/node_modules ./node_modules
    COPY . .
    RUN npm run build
    
    # --- Stage 3: minimal runtime -------------------------------------------------------
    FROM node:22-alpine AS runner
    WORKDIR /app
    ENV NODE_ENV=production \
        NUXT_HOST=0.0.0.0 \
        NUXT_PORT=3000 \
        PORT=3000
    
    # Only the built output is needed at runtime — node-server preset bundles dependencies.
    COPY --from=build /app/.output ./.output
    
    EXPOSE 3000
    
    HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
        CMD wget -qO- http://127.0.0.1:3000/ >/dev/null || exit 1
    
    USER node
    CMD ["node", ".output/server/index.mjs"]
    
# ─────────────────────────────────────────────
# Stage 1 – development (Vite dev server)
# ─────────────────────────────────────────────
FROM node:20-alpine AS dev

WORKDIR /app

# Install dependencies first (layer cache)
COPY package.json package-lock.json* ./
RUN npm cache clean --force && npm install --legacy-peer-deps

# Copy source
COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]

# ─────────────────────────────────────────────
# Stage 2 – builder (production build)
# ─────────────────────────────────────────────
FROM node:20-alpine AS build

ARG VITE_BACKEND_ENDPOINT
ENV VITE_BACKEND_ENDPOINT=$VITE_BACKEND_ENDPOINT

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm cache clean --force && npm install --legacy-peer-deps

COPY . .

RUN npm run build

# ─────────────────────────────────────────────
# Stage 3 – production (Nginx static serving)
# ─────────────────────────────────────────────
FROM nginx:1.27-alpine AS production

# Remove default Nginx static assets
RUN rm -rf /usr/share/nginx/html/*

# Copy built assets from build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Copy custom Nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

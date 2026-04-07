# ─── Stage 1: Build ───────────────────────────────────────────
FROM node:18-alpine AS build

WORKDIR /app

# Copy package files first (layer cache)
COPY package*.json ./
RUN npm ci --silent

# Copy source and build
COPY . .

# REACT_APP_API_URL is baked in at build time
ARG REACT_APP_API_URL
ENV REACT_APP_API_URL=$REACT_APP_API_URL

RUN npm run build

# ─── Stage 2: Serve with nginx ────────────────────────────────
FROM nginx:alpine

# Copy built React app
COPY --from=build /app/build /usr/share/nginx/html

# nginx config that handles React Router (no 404 on refresh)
RUN echo 'server { \
  listen 80; \
  root /usr/share/nginx/html; \
  index index.html; \
  location / { try_files $uri $uri/ /index.html; } \
}' > /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

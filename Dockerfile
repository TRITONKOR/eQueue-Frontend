# Build stage
FROM node:20-alpine AS builder

WORKDIR /app
COPY . .
RUN npm install
RUN npm run build

# Nginx stage
FROM nginx:alpine

RUN apk add --no-cache bash gettext

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx/default.conf.template /etc/nginx/templates/default.conf.template


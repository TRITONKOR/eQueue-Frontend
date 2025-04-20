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

ENV VITE_API_URL=http://host.docker.internal:3000

CMD /bin/sh -c "envsubst '\$VITE_API_URL' < /etc/nginx/templates/default.conf.template > /etc/nginx/conf.d/default.conf && exec nginx -g 'daemon off;'"

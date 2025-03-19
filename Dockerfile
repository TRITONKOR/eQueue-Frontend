FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install
RUN npm install -D sass-embedded

COPY . .

EXPOSE 5173

CMD ["npm", "run", "dev"]

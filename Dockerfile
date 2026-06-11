FROM node:20-alpine
WORKDIR /app
COPY deploy/server/package*.json ./
RUN npm install --production
COPY deploy/server/ .
EXPOSE 3000
CMD ["node", "index.js"]

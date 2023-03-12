FROM node:16-alpine

WORKDIR /app
COPY package.json .
RUN npm install --only=prod
RUN mkdir uploads
COPY . .

CMD ["npm", "start"]
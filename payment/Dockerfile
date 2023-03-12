# Create image from the base image
FROM node:14-alpine

#  Create a folder 'app' inside our image
WORKDIR /app

#  Copy package.json to the app folder
COPY package.json .

#  install all production dependencies in the app
RUN npm install --only=prod

#  Copy rest of the the files to the app folder
COPY . .

#  run command to start the app
CMD ["npm" ,"run" ,"start"]
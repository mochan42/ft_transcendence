FROM node:16

# Create app directory
WORKDIR /usr/src/client

# Install app dependencies
COPY package*.json ./

RUN npm install -g npm@9.8.1
RUN npm cache verify
RUN rm  -rf node_modules
RUN npm install

# Bundle app source
COPY . .

RUN npm run build

#EXPOSE 80:80
EXPOSE 3000:3000

CMD ["npm", "run", "start"]
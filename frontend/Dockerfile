FROM node:18.13.0

# Create app directory

WORKDIR /usr/src/client

# Install app dependencies
COPY package*.json ./

RUN npm install

# Bundle app source
COPY . .

RUN npm run build

EXPOSE 80:80

CMD ["npm", "run", "start"]
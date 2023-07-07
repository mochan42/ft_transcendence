FROM node:18.13.0

# Create app directory
WORKDIR /usr/src/app

RUN npm install -g @nestjs/cli

# Install app dependencies
COPY package*.json ./

RUN npm install

# Bundle app source
COPY . .

RUN npm run build

EXPOSE 5000:5000

CMD ["npm", "run", "start:dev"]
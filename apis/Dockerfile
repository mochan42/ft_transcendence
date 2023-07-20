FROM node:16

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./

#RUN npm install location=global @nestjs/cli
#RUN npm install -g npm@9.8.0
RUN npm cache clean --force
RUN rm  -rf node_modules
RUN npm install --force

# Bundle app source
COPY . .

RUN npm run build

EXPOSE 5000:5000

CMD ["npm", "run", "start:dev"]
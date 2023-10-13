FROM node:18

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./

#RUN npm install location=global @nestjs/cli
RUN npm install -g @nestjs/cli
RUN npm install -g npm@9.8.1
RUN npm cache verify
RUN rm  -rf node_modules
RUN npm i @nestjs/common @nestjs/config @nestjs/typeorm --legacy-peer-deps
RUN npm install  --legacy-peer-deps

# Bundle app source
COPY . .

RUN npm run build

EXPOSE 5000:5000

CMD ["npm", "run", "start:dev"]

FROM node:16

# Create app directory
WORKDIR /usr/src/client

# Install app dependencies
COPY package*.json ./

RUN npm cache clean --force
RUN rm  -rf node_modules
RUN npm install --force

# Bundle app source
COPY . .

RUN npm run build

#EXPOSE 80:80
EXPOSE 3000:3000

CMD ["npm", "run", "start"]
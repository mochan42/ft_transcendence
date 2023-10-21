FROM node:latest

COPY ./src/img ./

# Create app directory
WORKDIR /usr/src/client

# Copy package.json and package-lock.json
COPY package*.json ./

# Clean cache and install app dependencies
RUN npm cache clean --force
RUN npm install --legacy-peer-deps

# Bundle app source
COPY . .

# Build your application
RUN npm run build

# Expose the port
EXPOSE 3000

CMD ["npm", "run", "start"]
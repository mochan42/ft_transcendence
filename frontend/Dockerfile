FROM node:latest

# Create app directory
WORKDIR /usr/src/client

# Copy package.json and package-lock.json
COPY package*.json ./

# Install app dependencies
RUN npm install

# Bundle app source
COPY . .

# Build your application
RUN npm run build

# Expose the port
EXPOSE 3000

CMD ["npm", "run", "start"]
FROM node:latest

# Create app directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Clean cache and install app dependencies
RUN npm cache clean --force
RUN npm install --legacy-peer-deps

# Bundle app source
COPY . .

# Expose the port
EXPOSE 5000

CMD ["npm", "run", "start"]

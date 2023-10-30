# Use an official Node.js runtime as a parent image
FROM node:18

# Set the working directory in the container
WORKDIR /usr/src/client

# Copy both package.json and package-lock.json (if available)
COPY package*.json ./

# Upgrade application dependencies
#RUN npm update

# Clean cache and install app dependencies
RUN npm cache clean --force
RUN npm install --legacy-peer-deps

# Bundle your app source code
COPY . .

# Build your application
# RUN npm run build

# Expose the port the app will run on
EXPOSE 3000

# Define the command to run your app
CMD ["npm", "run","dev"]

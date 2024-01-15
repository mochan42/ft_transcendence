# Use an official Node.js runtime as a parent image
FROM node:18

# COPY ./src/img ./

# Create app directory
# Set the working directory in the container
WORKDIR /usr/src/client

# Copy both package.json and package-lock.json (if available)
# COPY package*.json ./

# Upgrade application dependencies
#RUN npm update

# Clean cache and install app dependencies
# RUN npm cache clean --force
# RUN npm install --legacy-peer-deps

# Bundle your app source code
COPY . .

# Build your application
# RUN npm run build

# Expose the port the app will run on
EXPOSE 3000

ENTRYPOINT [ "sh", "prestart.sh" ]

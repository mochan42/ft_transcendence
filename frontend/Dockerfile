# Use an official Node.js runtime as a parent image
FROM node:18

# Create app directory
# Set the working directory in the container
WORKDIR /usr/src/client

# Bundle your app source code
COPY . .

# Expose the port the app will run on
EXPOSE 3000

ENTRYPOINT [ "sh", "prestart.sh" ]

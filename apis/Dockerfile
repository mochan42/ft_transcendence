FROM node:18

# Set the working directory in the container
WORKDIR /usr/src/app

# # Copy both package.json and package-lock.json (if available)
# COPY package*.json ./

# # Upgrade application dependencies
# #RUN npm update

# # Clean cache and install app dependencies
# RUN npm cache clean --force
# RUN npm install --legacy-peer-deps

# Bundle your app source code
COPY . .

# Expose the port the app will run on
EXPOSE 5000

ENTRYPOINT [ "sh", "prestart.sh" ]

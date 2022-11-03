FROM node:16-alpine

WORKDIR /

# Install Dependencies
COPY package*.json /
RUN npm install
RUN npm install nodemon -g
RUN npm install typescript -g
# Copy app source code
COPY . .

# Exports
EXPOSE 8000

# CMD ["npm","run", "start"]
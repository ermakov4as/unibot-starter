FROM node:9

# Create app directory
WORKDIR /src

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY ./ /src
COPY package*.json ./

RUN npm install --production
# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
COPY . .

EXPOSE 8181
CMD [ "npm", "start" ]

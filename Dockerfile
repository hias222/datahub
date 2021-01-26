FROM node:14
# Create app directory
WORKDIR /usr/src/app

COPY dist/package*.json ./

RUN npm install
 
COPY dist/ .
# COPY --chown=node:node . .
EXPOSE 8080
CMD [ "npm", "run", "start" ]

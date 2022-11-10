FROM node:16

WORKDIR ./

COPY ./package.json .
RUN npm cache clean --force
RUN npm install
COPY . .

EXPOSE 8080

# CMD npm start
CMD [ "node", "server.js" ]
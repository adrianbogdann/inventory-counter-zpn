FROM node:14

WORKDIR ./app
COPY package.json .
# COPY .sequelizerc .
RUN npm install
# RUN npm run seedDB
COPY . .
CMD npm start
FROM node:19

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 5000
EXPOSE 5432

CMD ["npm", "start"]
FROM node:14-alpine
LABEL Maintainer_Name="Kozliuk Dmytro" Maintainer_Email="dmytro.kozliuk.ki.2020@gmail.com"
WORKDIR /app

ENV PATH /app/node_modules/.bin:$PATH

COPY package.json .
# COPY package-lock.json .
RUN npm install

COPY . .

CMD ["npm", "start"]
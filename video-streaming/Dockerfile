FROM node:18-alpine3.21

WORKDIR /usr/src/app
COPY package.json package-lock.json ./
RUN npm ci --omit=dev
COPY ./src ./src

CMD ["npm", "start"]

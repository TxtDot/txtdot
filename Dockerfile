FROM node:18-alpine as build
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build

FROM node:18-alpine as run
WORKDIR /app
COPY /app/dist /app/package*.json . --from=build
RUN npm install --omit=dev
CMD npm start
EXPOSE 8080

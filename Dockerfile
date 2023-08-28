FROM node:18-alpine as build
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build

FROM node:18-alpine as run
WORKDIR /app
COPY --from=build /app/dist/ /app/package*.json ./
RUN npm install --omit=dev
CMD npm run start:docker
EXPOSE 8080

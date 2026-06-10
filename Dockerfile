# STAGE 1 - pre build
FROM node:20-alpine AS builder

WORKDIR /app
# install packages
COPY ./package*.json ./
RUN npm install

# build source files
COPY . .
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL
RUN npm run build

#CMD ["npm", "run", "dev"]

# STAGE 2 - nginx serve
FROM nginx:alpine

WORKDIR /app_front

RUN rm -rf /usr/share/nginx/html/*

COPY --from=builder /app/dist /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
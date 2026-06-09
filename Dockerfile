# STAGE 1 - pre build
FROM node:20-alpine AS builder

WORKDIR /app
# install packages
COPY ./package*.json ./
RUN npm install

# build source files (copy only what the build needs instead of the whole context)
COPY ./index.html ./vite.config.ts ./tailwind.config.js ./
COPY ./tsconfig.json ./tsconfig.app.json ./tsconfig.node.json ./
COPY ./src ./src
COPY ./public ./public
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL
RUN npm run build

# STAGE 2 - nginx serve
FROM nginx:alpine

# Run nginx as the non-root "nginx" user while still serving on port 80:
# grant the binary the capability to bind privileged ports and make the
# runtime paths writable by that user.
RUN apk add --no-cache libcap && \
    setcap 'cap_net_bind_service=+ep' /usr/sbin/nginx && \
    chown -R nginx:nginx /var/cache/nginx && \
    touch /var/run/nginx.pid && chown nginx:nginx /var/run/nginx.pid

COPY --from=builder --chown=nginx:nginx /app/dist /usr/share/nginx/html

USER nginx

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
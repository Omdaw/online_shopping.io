# Stage 1
FROM node:14-alpine as build-step
RUN mkdir -p /app
WORKDIR /app
COPY package.json /app
RUN npm install
RUN npm install -g @angular/cli
COPY . /app
RUN ng build --prod
# RUN ng build --prod
RUN ls -la /app

# # Stage 2
FROM nginx:1.17.1-alpine
COPY --from=build-step /app/default.conf /etc/nginx/conf.d
COPY --from=build-step /app/dist /usr/share/nginx/html

RUN ls -la /usr/share/nginx/html
RUN ls -la /etc/nginx/conf.d
RUN cat /etc/nginx/conf.d/default.conf

# Change port to 3004 inside nginx
RUN cat /etc/nginx/conf.d/default.conf

# port expose 
EXPOSE 3004

# run nginx
CMD ["/bin/sh", "-c", "envsubst < /usr/share/nginx/html/assets/config/env.template.js > /usr/share/nginx/html/assets/config/env.js && sed -i \"s/listen  .*/listen $PORT;/g\" /etc/nginx/conf.d/default.conf && exec nginx -g 'daemon off;'"]


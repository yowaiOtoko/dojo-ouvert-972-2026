FROM nginx:alpine

COPY index.html /usr/share/nginx/html/index.html
COPY events.json /usr/share/nginx/html/events.json

EXPOSE 80

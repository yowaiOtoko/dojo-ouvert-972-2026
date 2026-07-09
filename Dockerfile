FROM nginx:alpine

COPY index.html /usr/share/nginx/html/index.html
COPY events.json /usr/share/nginx/html/events.json
COPY events.ics /usr/share/nginx/html/events.ics
COPY flyers/ /usr/share/nginx/html/flyers/

EXPOSE 80

FROM nginx:alpine

# Copy pre-built files from local dist directory
COPY apps/web-ui/dist/ /usr/share/nginx/html
COPY apps/web-ui/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

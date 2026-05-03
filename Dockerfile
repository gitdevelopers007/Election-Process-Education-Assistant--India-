# Use the lightweight Nginx image
FROM nginx:alpine

# Copy the static web files to Nginx's default HTML directory
COPY . /usr/share/nginx/html

# Cloud Run defaults to port 8080. We expose it here.
EXPOSE 8080

# Modify Nginx's default config to listen on 8080 instead of 80
RUN sed -i 's/listen  *80;/listen 8080;/' /etc/nginx/conf.d/default.conf

# Start the Nginx server
CMD ["nginx", "-g", "daemon off;"]

FROM node:22-alpine as build

ARG VITE_API_BASE_URL
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine

# Copy built files to nginx
COPY --from=build /app/dist /usr/share/nginx/html/alpha

# Create nginx config for /alpha
RUN echo 'server { \
    listen 3000; \
    location /alpha { \
        alias /usr/share/nginx/html/alpha; \
        try_files $uri $uri/ /alpha/index.html; \
    } \
    location / { \
        return 301 /alpha/; \
    } \
}' > /etc/nginx/conf.d/default.conf

EXPOSE 3000
CMD ["nginx", "-g", "daemon off;"]
# Build stage
FROM node:22-alpine as build

# Set build-time argument for API URL
ARG VITE_API_BASE_URL
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm ci

# Copy source code and build for production
COPY . .
RUN npm run build

# Production stage - Serve with Vite preview (or any static server)
FROM node:22-alpine as production

WORKDIR /app

# Install serve (or any static server)
RUN npm install -g serve

# Copy built files from build stage
COPY --from=build /app/dist ./dist

# Expose port
EXPOSE 3001

# Serve the built app
CMD ["serve", "-s", "dist", "-l", "3001"]

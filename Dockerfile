# Build the frontend
FROM node:20-alpine as frontend-builder
WORKDIR /app

# Copy the built wasm package from local filesystem
COPY calculator_wasm/pkg ./node_modules/calculator_wasm

# Install frontend dependencies
COPY frontend/package.json frontend/package-lock.json ./
RUN npm install

# Copy frontend source and build
COPY frontend .
RUN npm run build

# Build the frontend
FROM node:20-alpine as frontend-builder
WORKDIR /app

# Copy the built wasm package
COPY --from=rust-builder /usr/src/calculator_wasm/pkg ./node_modules/calculator_wasm

# Install frontend dependencies
COPY frontend/package.json frontend/package-lock.json ./
RUN npm install

# Copy frontend source and build
COPY frontend .
RUN npm run build

# Production stage
FROM node:20-alpine
WORKDIR /app
RUN npm install -g serve
COPY --from=frontend-builder /app/dist ./dist
EXPOSE 8080
CMD ["serve", "-s", "dist", "-l", "8080"] 
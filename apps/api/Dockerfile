# apps/api/Dockerfile
FROM node:18

WORKDIR /usr/src/app

# Copy package files first (for Docker cache)
COPY package*.json ./

# Install dependencies
RUN npm install --legacy-peer-deps

# Copy the rest of the code
COPY . .

# Expose app port
EXPOSE 8080

# Start app (migrate first, then start)
CMD ["sh", "-c", "npm run migrate && npm start"]
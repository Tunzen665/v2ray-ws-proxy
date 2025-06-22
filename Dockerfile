# Use Node.js as the base image
FROM node:18

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package.json ./
RUN npm install

# Copy the WebSocket proxy server code
COPY server.js .

# Expose port
EXPOSE 8080

# Start the server
CMD ["node", "server.js"]

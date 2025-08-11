# Use the official Node.js 20 image.
FROM node:20-slim

# Set the working directory in the container.
WORKDIR /app

# Copy package.json and package-lock.json to the working directory.
COPY package*.json ./

# Install dependencies.
RUN npm install

# Copy the rest of the application code to the working directory.
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build the Next.js application for production.
RUN npm run build

# Expose the port the Next.js application runs on.
EXPOSE 3000

# The command to start the Next.js application.
CMD ["npm", "start"]

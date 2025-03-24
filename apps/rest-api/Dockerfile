#Build Stage
FROM node:22.14.0 as build

WORKDIR /app

# Copy package.json and package-lock.json 
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Build the application
RUN npx build rest-api

# Production Stage
FROM node:22.14.0

WORKDIR /app

# Copy the build articacts from the build stage
COPY --from=build /app/dist/apps/rest-api /app
COPY --from=build /app/node_modules /app/node_modules
COPY --from=build /app/package.json /app/package.json

# Expose the port the app runs on
EXPOSE 3000

# Serve the app
CMD ["node", "main.js"]
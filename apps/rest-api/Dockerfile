FROM node:22.14.0 

WORKDIR /app

# Copy only the built files and package files
COPY apps/rest-api/dist/ ./dist
COPY package*.json ./

# Install only production dependencies
RUN npm install

EXPOSE 3000
CMD ["node", "dist/main.js"]
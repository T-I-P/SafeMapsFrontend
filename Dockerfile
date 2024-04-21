FROM node:20.11.0 AS build

# Set working directory for the frontend
WORKDIR /safemaps_combined/front

# Copy package.json and package-lock.json for frontend
COPY ./package.json ./package-lock.json ./

# Copy frontend source code
COPY . .

# Install frontend dependencies
RUN npm install

EXPOSE 3001

# Build frontend
CMD ["npm", "start"]
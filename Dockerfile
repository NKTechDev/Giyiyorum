# Step 1: Build the React app
FROM node:latest

# Set the working directory in the container
WORKDIR /app

# Copy the package.json and package-lock.json (or yarn.lock) into the container
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the rest of the React app files into the container
COPY . ./

# Expose the port that your React app will run on (usually 3000)
EXPOSE 3000

# Start the React development server
CMD ["npm", "run", "dev"]

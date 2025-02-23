FROM node:20.12.2

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./



# Install npm packages and rebuild bcrypt
RUN npm install

# Copy the rest of the application code
COPY . .

# Copy the .env file
COPY .env .

# Build the application (if needed)
# RUN npm run build

# Expose the port
EXPOSE ${MY_PORT}

# Set environment variables
ENV NODE_ENV=${NODE_ENV}

ENV LOCAL_PORT=${LOCAL_PORT}
ENV LOCAL_HOST=${LOCAL_HOST}
ENV LOCAL_DATABASE=${LOCAL_DATABASE}
ENV LOCAL_USER=${LOCAL_USER}
ENV LOCAL_PASSWORD=${LOCAL_PASSWORD}

ENV BCRYPT_ROUNDS=${BCRYPT_ROUNDS}
ENV SIGN_KEY=${SIGN_KEY}

ENV S3ACCESSKEY =${S3ACCESSKEY}
ENV SECRETACCESSKEEY=${SECRETACCESSKEEY}
ENV STORAGE_NAME =${STORAGE_NAME}

# Start the application
CMD ["npm", "start"]
FROM node:10-buster

# install additional dependencies
RUN apt-get update && apt-get install -y \
    man \
    bsdmainutils

# set working directory
ENV APP_PATH /app/
WORKDIR ${APP_PATH}

# copy the node files and install modules
COPY package.json package-lock.json ${APP_PATH}
RUN npm install

# copy the rest of the application
COPY . ${APP_PATH}

# update the env file with production values if building for production
ARG BUILD_ENV=development
RUN if [ "$BUILD_ENV" = "production" ]; then cp prod_env .env ; fi

# expose the port for the app
EXPOSE 8765

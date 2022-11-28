FROM node:18.2.0

LABEL maintainer="Tadeo Armenta"

# Create app directory
RUN mkdir -p /usr/app
WORKDIR /usr/app

EXPOSE 4040
EXPOSE 4141
EXPOSE 4242

# Create a dedicated user
#RUN addgroup -S nodejs && adduser -S -g nodejs nodejs
RUN addgroup --system --gid 1001 nodejs \
      && adduser --system --uid 1001 --ingroup nodejs --shell /bin/bash nodejs \
      && chown -R nodejs:nodejs /usr/app

# Bundle app source
COPY  . $WORKDIR

# unknown is the default, but you can override it with --build-arg APP_VERSION=0.0.1 during docker build
ARG APP_VERSION=unknown
ENV APP_VERSION $APP_VERSION

# production is the default, but you can override it with --build-arg NODE_ENV=development during docker build
ARG NODE_ENV=production
ENV NODE_ENV $NODE_ENV

# unknown is the default, but you can override it with --build-arg RELEASE_DATE=$(date +"%Y/%m/%d") during docker build
ARG RELEASE_DATE=unknown
LABEL com.boringresearchco.azeroth-backend.author="Tadeo Armenta" \
      com.boringresearchco.azeroth-backend.release-date=$RELEASE_DATE \
      com.boringresearchco.azeroth-backend.release-version=$APP_VERSION

# Use node user
USER nodejs
# Run...
RUN if [ ${NODE_ENV} != "production" ]; then \
yarn install; \
else \
    # This will prune all the "development" dependencies
    yarn install --production --ignore-scripts --prefer-offline; \
fi

CMd yarn start

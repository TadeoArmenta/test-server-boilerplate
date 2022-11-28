#!/bin/bash

APP_VERSION=$(node -pe "require('./package.json').version")
PACKAGE_NAME=$(node -pe "require('./package.json').name")
RELEASE_DATE=$(date +"%Y/%m/%d")
DOCKER_REGISTRY="docker.boringresearch.co"
DOCKER_REGISTRY_USER=".-.hordeplayer.-."
DOCKER_REGISTRY_PASSWORD="docker.boringresearch.co"
PUSH=false

while getopts "p:" flag
do
    case "${flag}" in
        p) PUSH=true;;
        *) echo "usage: $0 [-push|p]" >&2
               exit 1 ;;
    esac
done
docker build -t ${DOCKER_REGISTRY}/"${PACKAGE_NAME}":"${APP_VERSION}" \
--build-arg APP_VERSION="${APP_VERSION}" \
--build-arg RELEASE_DATE="${RELEASE_DATE}" \
.

docker tag ${DOCKER_REGISTRY}/"${PACKAGE_NAME}":"${APP_VERSION}" ${DOCKER_REGISTRY}/"${PACKAGE_NAME}":latest

if [ ${PUSH} == "true" ]; then
    docker login -u=${DOCKER_REGISTRY_USER} -p=${DOCKER_REGISTRY_PASSWORD}  ${DOCKER_REGISTRY}
    docker push ${DOCKER_REGISTRY}/"${PACKAGE_NAME}":"${APP_VERSION}"
    docker push ${DOCKER_REGISTRY}/"${PACKAGE_NAME}":latest
fi
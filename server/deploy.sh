#!/bin/bash

echo What should the version be?
read VERSION

docker build -t softorca/rabbit:$VERSION .
docker push softorca/rabbit:$VERSION
ssh root@167.71.89.38 "docker pull softorca/rabbit:$VERSION && docker tag softorca/rabbit:$VERSION dokku/api:$VERSION && dokku deploy api $VERSION"
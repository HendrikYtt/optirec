#!/bin/bash

kubectl delete secret registry
kubectl delete secret regcred

docker run \
  --entrypoint htpasswd \
  httpd:2 -Bbn nrocinu $1 > htpasswd

kubectl create secret generic registry --from-file=htpasswd

kubectl delete secret regcred
kubectl create secret docker-registry regcred \
  --docker-username=nrocinu \
  --docker-password=$1 \
  --docker-server=registry.optirec.ml

kubectl patch serviceaccount default -p '{"imagePullSecrets": [{"name": "regcred"}]}'

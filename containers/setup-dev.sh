#!/bin/bash

root_dir=$(pwd)

# Install dependencies
sudo apt update
sudo apt install -y ca-certificates curl gnupg lsb-release

sudo wget -qO /usr/local/bin/yq https://github.com/mikefarah/yq/releases/latest/download/yq_linux_amd64
sudo chmod a+x /usr/local/bin/yq

# Install docker
sudo mkdir -m 0755 -p /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg -y --dearmor -o /etc/apt/keyrings/docker.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

if ! [ $(getent group docker) ]; then
  sudo groupadd docker
  sudo usermod -aG docker $USER
  newgrp docker
    fi

# Install minikube
curl -LO https://storage.googleapis.com/minikube/releases/latest/minikube-linux-amd64
sudo install minikube-linux-amd64 /usr/local/bin/minikube
sudo rm minikube-linux-amd64

minikube start
minikube kubectl -- version

# Install kustomize
cd /usr/local/bin
curl -s "https://raw.githubusercontent.com/kubernetes-sigs/kustomize/master/hack/install_kustomize.sh"  | sudo bash
cd $root_dir

# Configuring kubernetes cluster
minikube addons enable ingress

kubectl create namespace nrocinu
kubectl config set-context --current --namespace nrocinu

kubectl create secret docker-registry regcred \
  --docker-username=nrocinu \
  --docker-password=FJ85GMrawBsuMn \
  --docker-server=registry.optirec.ml
kubectl patch serviceaccount default -p '{"imagePullSecrets": [{"name": "regcred"}]}'

docker run \
  --entrypoint htpasswd \
  httpd:2 -Bbn admin admin > htpasswd
kubectl create secret generic registry --from-file=htpasswd
rm -f htpasswd

docker run \
  --entrypoint htpasswd \
  httpd:2 -Bbn admin admin > auth
kubectl create secret generic warmbet-basic --from-file=auth
kubectl create secret generic basic-auth --from-file=auth
rm -f auth


kubectl patch -n ingress-nginx configmap/ingress-nginx-controller --type merge -p '{"data":{"ssl-redirect":"false"}}'
kubectl rollout restart -n ingress-nginx deploy/ingress-nginx-controller

# Setup optirec
cd kubernetes
rm -f kustomization.yaml
touch kustomization.yaml
kustomize edit add resource **/*.yaml
cd $root_dir

kubectl apply -k overlays/dev/

# Configure access to the services
domains=$(yq e '.spec.rules[0].host' kubernetes/**/ingress.yaml | grep -v '\-\-\-' | sed 's/optirec.ml/optirecdev.ml/' | paste -sd ' ' -)
ip=$(minikube ip)

grep -v optirec /etc/hosts > /tmp/hosts
echo "$ip $domains" >> /tmp/hosts
sudo mv /tmp/hosts /etc/hosts

# Configure aliases
aliases=$(echo "source $root_dir/bash_aliases.sh")
grep -qxF "$aliases" ~/.bashrc || echo "$aliases" >> ~/.bashrc
eval "$aliases"

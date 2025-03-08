#!/bin/bash

# target="hendrikytt@k8s.hashtatic.com"
target="root@coolbetdev.com"

ssh $target
cd /tmp

openssl genrsa -out nrocinu.key 2048
openssl req -new -key nrocinu.key -out nrocinu.csr -subj "/CN=nrocinu/O=nrocinu"
# openssl x509 -req -in nrocinu.csr -CA /etc/kubernetes/pki/ca.crt -CAkey /etc/kubernetes/pki/ca.key  -CAcreateserial -out nrocinu.crt -days 45
openssl x509 -req -in nrocinu.csr -CA /var/snap/microk8s/current/certs/ca.crt -CAkey /var/snap/microk8s/current/certs/ca.key  -CAcreateserial -out nrocinu.crt -days 365

exit

scp $target:/tmp/nrocinu.key .
scp $target:/tmp/nrocinu.crt .

k config set-credentials nrocinu --client-certificate nrocinu.crt --client-key nrocinu.key --embed-certs=true
k config set-context nrocinu --cluster=coolbet-dev --namespace=nrocinu --user=nrocinu
k config use-context nrocinu

# update role:
client-dev
ns nrocinu
k apply -f kubernetes/role.yaml
k config use-context nrocinu

# generate kube config
k config view --minify --raw -o yaml > kubeconfig.yaml

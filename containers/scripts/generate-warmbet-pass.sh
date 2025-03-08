docker run \
  --entrypoint htpasswd \
  httpd:2 -Bbn warmbet $1 > htpasswd

kubectl create secret generic warmbet-basic --from-file=htpasswd

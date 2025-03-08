kubectl create namespace argocd
kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml

cat <<EOF | k apply -f -
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: argocd-server-ingress
  namespace: argocd
  annotations:
    cert-manager.io/cluster-issuer: letsencrypt
    kubernetes.io/ingress.class: public
    kubernetes.io/tls-acme: "true"
    nginx.ingress.kubernetes.io/ssl-passthrough: "true"
    # If you encounter a redirect loop or are getting a 307 response code
    # then you need to force the nginx ingress to connect to the backend using HTTPS.
    #
    nginx.ingress.kubernetes.io/backend-protocol: "HTTPS"
spec:
  rules:
  - host: argocd.optirec.ml
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: argocd-server
            port:
              name: https
  tls:
  - hosts:
    - argocd.optirec.ml
    secretName: argocd-secret # do not change, this is provided by Argo CD
EOF

curl -sSL -o argocd-linux-amd64 https://github.com/argoproj/argo-cd/releases/latest/download/argocd-linux-amd64
sudo install -m 555 argocd-linux-amd64 /usr/local/bin/argocd
rm -f argocd-linux-amd64

argocd admin initial-password -n argocd
argocd login argocd.optirec.ml
argocd account update-password

argocd cluster add coolbet-dev

kubectl -n argocd create secret generic git-creds --from-file=sshPrivateKey=/home/hendrikutt/.ssh/id_rsa
argocd repo add ssh://git@github.com/HendrikYtt/optirec.git --ssh-private-key-path /home/hendrikutt/.ssh/id_rsa

kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj-labs/argocd-image-updater/stable/manifests/install.yaml

cat <<EOF | k apply -f -
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: argocd-image-updater
rules:
- apiGroups: [""]
  resources: ["secrets"]
  verbs: ["get"]
EOF

cat <<EOF | k apply -f -
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRoleBinding
metadata:
  name: argocd-image-updater
subjects:
- kind: ServiceAccount
  name: argocd-image-updater
  namespace: argocd
roleRef:
  kind: ClusterRole
  name: argocd-image-updater
EOF

cat <<EOF | k apply -f -
apiVersion: v1
kind: ConfigMap
metadata:
  name: argocd-image-updater-config
data:
  log.level: debug
  registries.conf: |
    registries:
    - name: Docker Registry V2
      prefix: registry.optirec.ml
      api_url: https://registry.optirec.ml
      credentials: pullsecret:nrocinu/regcred
EOF

k rollout restart -n argocd deployment argocd-image-updater

argocd proj create optirec-stage -d https://95.217.193.120:16443,nrocinu -s ssh://git@github.com/HendrikYtt/optirec.git
argocd appset create kubernetes/application-set.yaml

# configure git webhook:
kubectl edit secret argocd-secret -n argocd
# stringData:
#   webhook.github.secret: ...

LATEST=$(curl -s https://api.github.com/repos/prometheus-operator/prometheus-operator/releases/latest | jq -cr .tag_name)
curl -sL https://github.com/prometheus-operator/prometheus-operator/releases/download/${LATEST}/bundle.yaml | kubectl create -f -

kubectl wait --for=condition=Ready pods -l  app.kubernetes.io/name=prometheus-operator -n default

kubectl delete secret prometheus-auth

password=$(openssl rand -base64 14)
echo "Prometheus password: $password"

htpasswd -b -c auth admin "$password"
kubectl create secret generic prometheus-auth --from-file=auth
rm -f auth

cat <<EOF | k apply -f -

apiVersion: v1
kind: ServiceAccount
metadata:
  name: prometheus

---

apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: prometheus
rules:
- apiGroups: [""]
  resources:
  - nodes
  - nodes/metrics
  - services
  - endpoints
  - pods
  verbs: ["get", "list", "watch"]
- apiGroups: [""]
  resources:
  - configmaps
  verbs: ["get"]
- apiGroups:
  - networking.k8s.io
  resources:
  - ingresses
  verbs: ["get", "list", "watch"]
- nonResourceURLs: ["/metrics"]
  verbs: ["get"]

---

apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRoleBinding
metadata:
  name: prometheus
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: ClusterRole
  name: prometheus
subjects:
- kind: ServiceAccount
  name: prometheus
  namespace: default

---

apiVersion: monitoring.coreos.com/v1
kind: Prometheus
metadata:
  name: prometheus
spec:
  serviceAccountName: prometheus
  serviceMonitorSelector:
    matchLabels:
      kind: service-monitor
  resources:
    requests:
      memory: 400Mi
  enableAdminAPI: false
  externalUrl: https://prometheus.optirec.ml
---

apiVersion: v1
kind: Service
metadata:
  name: prometheus
spec:
  type: ClusterIP
  ports:
  - name: web
    port: 9090
    protocol: TCP
    targetPort: web
  selector:
    prometheus: prometheus

---

apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: prometheus
  annotations:
    nginx.ingress.kubernetes.io/rewrite-target: /$1
    nginx.ingress.kubernetes.io/proxy-body-size: 5G
    nginx.ingress.kubernetes.io/proxy-read-timeout: 3600s
    nginx.ingress.kubernetes.io/proxy-send-timeout: 3600s
    nginx.ingress.kubernetes.io/auth-type: basic
    nginx.ingress.kubernetes.io/auth-secret: prometheus-auth
    nginx.ingress.kubernetes.io/auth-realm: 'Authentication Required - Prometheus'
spec:
  ingressClassName: public
  rules:
    - host: prometheus.optirec.ml
      http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: prometheus
                port:
                  number: 9090
  tls:
    - secretName: tls-secret

EOF

LATEST=$(curl -s https://api.github.com/repos/kubernetes/kube-state-metrics/releases/latest | jq -cr .tag_name)
curl -sL https://raw.githubusercontent.com/kubernetes/kube-state-metrics/main/examples/standard | kubectl create -f -


wget https://github.com/kubernetes/kube-state-metrics/archive/refs/tags/${LATEST}.zip
unzip ${LATEST}.zip -d kube-state-metrics
k apply -f kube-state-metrics/kube-state-metrics-${LATEST:1}/examples/standard

rm -f ${LATEST}.zip
rm -rf kube-state-metrics

cat <<EOF | k apply -f -

apiVersion: monitoring.coreos.com/v1
kind: ServiceMonitor
metadata:
  name: kube-state-metrics
  labels:
    kind: service-monitor
spec:
  jobLabel: kube-state-metrics
  selector:
    matchLabels:
      app.kubernetes.io/name: kube-state-metrics
  namespaceSelector:
    matchNames:
    - kube-system
  endpoints:
  - port: http-metrics
    interval: 15s
EOF
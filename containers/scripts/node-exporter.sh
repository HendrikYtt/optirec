cat <<EOF | k apply -f -
kind: Service
apiVersion: v1
metadata:
  name: node-exporter
  namespace: monitoring
  labels:
    app.kubernetes.io/name: node-exporter
spec:
  selector:
      app.kubernetes.io/name: node-exporter
  ports:
  - name: http-metrics
    protocol: TCP
    port: 9100
    targetPort: 9100

---

apiVersion: monitoring.coreos.com/v1
kind: ServiceMonitor
metadata:
  name: node-exporter
  labels:
    kind: service-monitor
spec:
  jobLabel: node-exporter
  selector:
    matchLabels:
      app.kubernetes.io/name: node-exporter
  namespaceSelector:
    matchNames:
    - monitoring
  endpoints:
  - port: http-metrics
    interval: 15s
EOF
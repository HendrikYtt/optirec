cat <<EOF | k apply -f -
apiVersion: v1
kind: PersistentVolume
metadata:
  name: airflow
  labels:
    type: local
spec:
  storageClassName: microk8s-hostpath
  capacity:
    storage: 10Gi
  accessModes:
    - ReadWriteMany
  hostPath:
    path: "/opt/airflow"

---

apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: airflow
spec:
  accessModes:
    - ReadWriteMany
  volumeMode: Filesystem
  resources:
    requests:
      storage: 10Gi
  storageClassName: microk8s-hostpath
EOF

helm install airflow --namespace airflow apache-airflow/airflow --values values.yaml


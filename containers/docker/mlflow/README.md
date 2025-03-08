```bash
docker build . -t registry.optirec.ml/mlflow:latest
docker push registry.optirec.ml/mlflow:latest

k create namespace mlflow
k config set-context --current --namespace mlflow
 
k get secret -n nrocinu regcred -o yaml | sed 's/nrocinu/mlflow/' | k apply -f -
k patch serviceaccount default -p '{"imagePullSecrets": [{"name": "regcred"}]}'

k delete secret mlflow
k create secret generic mlflow --from-literal=value="sqlite:////mlflow.db"
helm install mlflow -f values.yaml --namespace mlflow chart/

```

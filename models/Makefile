SHELL := /bin/bash

install:
	test -d .venv || python3 -m venv .venv
	source .venv/bin/activate; pip3 install -r requirements.txt	

run:
	source .venv/bin/activate; PYTHONPATH=$PYTHONPATH:src python3 src/app.py

push:
	docker build . -t registry.optirec.ml/models:latest
	docker push registry.optirec.ml/models:latest

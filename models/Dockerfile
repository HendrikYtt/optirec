FROM registry.optirec.ml/pyspark:latest
WORKDIR /usr/src/app

RUN pip3 install watchdog

COPY requirements.txt ./
RUN pip3 install -r requirements.txt

COPY . ./

ENV PYTHONPATH $PYTHONPATH:src

RUN chmod +x ./entrypoint.sh
CMD [ "./entrypoint.sh" ]

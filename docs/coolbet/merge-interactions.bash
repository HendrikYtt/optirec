#!/bin/bash

cd data/prod-2023-03-14
head -n 1 interactions-2023-03-07.csv > interactions.csv && tail -n+2 -q interactions-*.csv >> interactions.csv

#!/bin/sh

set -e

if [ "$RELOAD" == "true" ]; then
    exec nodemon dist/index.js
else
    exec node dist/index.js
fi

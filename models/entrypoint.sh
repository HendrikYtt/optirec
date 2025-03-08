#!/bin/sh

set -x
set -e

SERVICE=${SERVICE:-"app"}

command="python3 src/$SERVICE.py"
if [ "$RELOAD" = "true" ]; then
    command="watchmedo auto-restart -d src -p '*.py' -R -- $command"
fi

exec $command

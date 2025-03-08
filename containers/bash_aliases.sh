#!/bin/bash

alias rec='kubectl rollout restart deploy'

function teler() {
    image=$(k get deploy $1 -o=jsonpath={.spec.template.spec.containers[0].image})
    command=$(k get deploy $1 -o=jsonpath={.spec.template.spec.containers[0].command} | jq -r '. | join(" ")')
    if ! [[ -z $command ]]; then
        echo Overwriting command with $command
    fi

    teleroot="/tmp/telepresence/$1"
    coderoot=$(pwd)
    rm -rf $teleroot

    volumes=""
    mounts=$(k get deploy $1 -o=jsonpath="{.spec.template.spec.containers[0].volumeMounts[*].mountPath}")
    for mount in $mounts; do
        volumes="$volumes -v $teleroot$mount:$mount"
    done

    docker pull $image

    telepresence --swap-deployment $1 \
        --logfile /tmp/telepresence.log \
        --mount $teleroot \
        --docker-run \
        --name $1-telepresence-container \
        --rm \
        -v $coderoot:/usr/src/app \
        -e RELOAD=true \
        $volumes \
        $image $command
}

function cpy() {
    for file in $(sudo find . -name "__pycache__" | grep -v 'venv'); do
        sudo rm -rf $file
    done
}

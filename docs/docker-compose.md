---
id: docker-compose
title: Run StreamsDB localy with Docker Compose
sidebar_label: docker-compose
---

This document describes how to run StreamsDB localy with Docker Compose. It runs FoundationDB, StreamsDB, graphql api gateway and the administrative web ui.

## Prerequizites

* docker
* docker-compose
* sdbcli

## docker-compose.yml

Create a file called `docker-compose.yml` with the following content:

```yaml
version: '3'
services:
  # foundation db storage layer
  fdb:
    image: foundationdb/foundationdb:6.1.10
    environment:
      - FDB_COORDINATOR:fdb
  
  # initialization job for foundationdb
  init:
    image: foundationdb/foundationdb:6.1.10
    command:
      [ "/bin/bash", "-c", 
        "source /var/fdb/scripts/create_cluster_file.bash; FDB_COORDINATOR=fdb create_cluster_file ; fdbcli --exec status | grep -m 1 'no database' &> /dev/null && fdbcli --exec 'configure new single ssd' || echo 'db already exists'" ]
    environment:
      - FDB_COORDINATOR:fdb
    depends_on:
      - fdb
    restart: on-failure

  # streamsdb node
  sdb:
    image: streamsdb/sdb:master
    environment:
      FDB_COORDINATOR: fdb
      LOG: debug
    links:
      - fdb
    restart: unless-stopped
    ports:
      - 6000:6000

  # graphql api
  graphql:
    image: streamsdb/sdbgql:master
    environment:
      PORT: 3000
      SDB_HOST: sdb://sdb:6000?insecure=1&block=1
      HEALTH: "false"
      LOG: debug
    links:
      - sdb
    restart: unless-stopped

  # administration web ui
  admin:
    image: streamsdb/admin:latest
    environment:
      PORT: 3000
      API: "http://graphql:3000"
    links:
      - graphql
    ports:
      - 4000:3000
    restart: unless-stopped
```

## Start

In the same directory execute `docker-compose up -d`. Compose will download the images and start the containers.

## Admin

You can now open a browser and see the administrative web ui at: [localhost:4000](http://localhost:4000)

## Create a database

In the same terminal set the `SDB_HOST` environment variable to point to the local streamsdb node:

```
export SDB_HOST="sdb://localhost:6000/?insecure=1"
```

Now create a database using `sdbcli`:

```
sdbcli create-database demo
```

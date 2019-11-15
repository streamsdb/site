---
id: getting-started-compose
title: Getting Started docker compose
sidebar_label: Docker Compose
---

This document describes how to run StreamsDB localy with Docker Compose. It runs FoundationDB, StreamsDB, graphql api gateway and the administrative web ui.

## Prerequizites

* [Docker](https://docs.docker.com/install/)
* [docker-compose](https://docs.docker.com/compose/install/)
* [StreamsDB CLI](getting-started-cli.md)

## Composition

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
        "source /var/fdb/scripts/create_cluster_file.bash;
         FDB_COORDINATOR=fdb create_cluster_file ;
         fdbcli --exec status
         | grep -m 1 'no database' &> /dev/null
         && fdbcli --exec 'configure new single ssd' 
         || echo 'db already exists'" ]
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
    image: streamsdb/admin:master
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

Execute the following command to download all images and start the containers, make sure you execute this command in the same directory as the `docker-compose.yml` file we just created in the previous step:

```
docker-compose up -d
```

## Create a database

Use sdbcli to create a new database:

```
export SDB_HOST="sdb://localhost:6000/?insecure=1"
sdbcli create-database demo
```

## Admin

Open a browser and see the admin ui at: [localhost:4000](http://localhost:4000)

## Discard containers and state

To stop and remove the containers including the state:

```
docker-compose down -v
```

---
id: getting-started-cli
title: Getting Started
sidebar_label: CLI
---

This document describes how to write and read your first events to StreamsDB with the command line utility `sdbcli`.

## Introduction

StreamDB comes with a command line interface tool called  `sdbcli` . This document describes the basic usage of `fdbcli` and the commands it support. The tool is distributed as a [docker image](https://hub.docker.com/r/streamsdb/sdbcli).

## Prerequisite

* [Docker](https://docs.docker.com/install/)

## Installation

The easiest way to use the `sdbcli` docker image is to create an alias:

``` SHELL
alias sdbcli='docker run --env="SDB_HOST=$SDB_HOST" \
                         --volume="$HOME:/root/" \
                         --network="host" \
                         --interactive \
                         --tty \
                         --rm \
                         streamsdb/sdbcli'
```

To keep aliases between sessions, you can save them in your user’s shell configuration profile file.

### BASH

``` SHELL 
echo 'alias sdbcli="docker run --env="SDB_HOST=\$SDB_HOST" \
                         --volume="$HOME:/root/" \
                         --network="host" \
                         --interactive \
                         --tty \
                         --rm \
                         streamsdb/sdbcli"' \
>> $HOME/.bashrc
```

### ZSH

``` SHELL 
echo 'alias sdbcli="docker run --env="SDB_HOST=\$SDB_HOST" \
                         --volume="$HOME:/root/" \
                         --network="host" \
                         --interactive \
                         --tty \
                         --rm \
                         streamsdb/sdbcli"' \
>> $HOME/.zshrc
```

## FISH

``` SHELL 
echo 'alias sdbcli="docker run --env="SDB_HOST=\$SDB_HOST" \
                         --volume="$HOME:/root/" \
                         --network="host" \
                         --interactive \
                         --tty \
                         --rm \
                         streamsdb/sdbcli"' \
>> $HOME/.config/fish/config.fish
```

## Connection string

By default `sdbcli` will connect to a local instance of StreamsDB. You can change this behaviour by providing a [connection string](/docs/connection-string) via the `SDB_HOST` environment variable or `--host` flag.

### SDB_HOST

``` BASH
export SDB_CLI="sdb://username:password@us-west.streamsdb.io:443/database_name"
sdbcli env
```

### --host flag

``` BASH
sdbcli --host="sdb://username:password@us-west.streamsdb.io:443/database_name" env
```

## Ping StreamsDB

``` BASH
sdbcli ping
```

The ping command should reply with a `Pong!` response.

## Login

If the StreamsDB server requires authentication, you can either specify a username and password in the [`connection string`](#connection-string] or use the `sdbcli login` command.

The login command will store the authentication token on disk at `$HOME/.sdbtoken` and will be used to all subsequent `sdbcli` commands until `sdbcli logout` is used.

``` BASH
sdbcli login
```

## Append your first event

We will now use the `append` command to write an event message to a stream. Its syntax is `sdbcli append <STREAM> <EVENTTYPE> <VALUE>`.

The `<STREAM>` argument is the name of the stream, the `<EVENTTYPE>` argument is the name of the type of the event and the `<VALUE>` argument can either be a string value, or `-` to read from STDIN.

Execute the following command to append the value a message to the `welcome` stream:

``` BASH
sdbcli append welcome string "HELLO WORLD from $USER"
```

The append command responds with a number. This is the position of the message in the stream we just wrote.

## Reading the events

The `welcome` stream should have at least the event we just wrote to it. Lets query the last 10 events of the `welcome` stream to see it:

``` BASH
sdbcli read --from="-10" welcome
```

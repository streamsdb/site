---
id: doc1
title: Getting Started
sidebar_label: Example Page
---

This document describes how to write and read your first events to StreamsDB with the command line utility `sdbcli`.

## Prerequisite

* [Docker](https://docs.docker.com/install/)

## Install SDBCLI

StreamDB comes with a command line interface tool called  `sdbcli` . This document describes the basic usage of `fdbcli` and the commands it support. 

The easiest way to use `sdbcli` is via Docker. To use it create an alias that runs the [`streamsdb/sdbcli`](https://hub.docker.com/r/streamsdb/sdbcli) docker image by executing the following commands:

``` BASH
alias sdbcli='docker run -it streamsdb/sdbcli -e "SDB_HOST=$SDB_HOST"'
export SDB_HOST="sdb://api.streamsdb.io:443/default?tls=1&block=1"
```

You can make `sdbcli` alias permanent available by adding it to you `.bashrc` or `.zshrc`:

```
echo "export SDB_HOST=$SDB_HOST" >> ~/.bashrc"
echo "$(alias sdbcli)" >> ~/.bashrc"
```

Now we can ping StreamsDB to verify we can reach the default server:

``` BASH
sdbcli ping
```

The ping command should reply with the roundtrip duration.

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

## Web admin

You can also use the web admin to see your event:

[web admin](https://app.streamsdb.io/default/streams/welcome/last)
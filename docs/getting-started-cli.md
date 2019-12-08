---
id: getting-started-cli
title: Getting Started CLI
sidebar_label: CLI
---

## Introduction

StreamsDB comes with a command line interface tool called sdbcli. The tool is distributed as a [docker image](https://hub.docker.com/r/streamsdb/sdbcli).

## Prerequisite

* [Docker](https://docs.docker.com/install/)

## Installation

The easiest way to use the sdbcli docker image is to create an alias:

```bash
alias sdbcli='docker run --env="SDB_HOST=$SDB_HOST"
                         --volume="$HOME:/root/"
                         --network="host"
                         --interactive
                         --tty
                         --rm
                         streamsdb/sdbcli'
```

To keep aliases between sessions, you can save them in your user’s shell configuration profile file. For example, `$HOME/.bashrc`, `$HOME/.zshrc` or `$HOME/.config/fish/config.fish` depending on your shell.

## Connection string

By default sdbcli will connect to a local instance of StreamsDB. You can change this behaviour by providing a [connection string](/docs/connection-string) to the `SDB_HOST` environment variable or the `--host` flag.

### SDB_HOST environment variable

```bash
export SDB_HOST="sdb://username:password@us-west.streamsdb.io:443/database_name"
```

### host flag

```bash
sdbcli --host="sdb://username:password@us-west.streamsdb.io:443/database_name" <COMMAND>
```

## Login

If the StreamsDB server or database requires authentication, you can specify a username and password in the [`connection string`](#connection-string) or use the `login` command.

The `login` command will authenticate with the provides username and password and store the authentication token on disk. The token stored on disk will be used for all subsequent commands till the logout command is used.

```bash
sdbcli login
```

The login command will ask for a username and password from stdin. For scripts we recommend to use a connection string with a username and password.

## Append to a stream

Use the `append` command to write event messages to a stream. Its syntax is `sdbcli append <STREAM> <EVENTTYPE> <VALUE>`.

The `<STREAM>` argument is the name of the stream, the `<EVENTTYPE>` argument is the name of the type of the event and the `<VALUE>` argument can either be a string value, or `-` to read from STDIN.

Here is an example that appends the message "HELLO WORLD from <user>" to the `welcom` stream:

``` BASH
sdbcli append welcome string "HELLO WORLD from $USER"
```

Alternatively you can use `-` to read from STDIN:

```bash
echo "HELLO WORLD from $USER" | sdbcli append welcome string -
```

The append command prints the position of the written message.

## Reading from a stream

Use the `read` command to read from a stream. Its syntax is `sdbcli read <STREAM>`.

```bash
sdbcli read stream_name
```

To specify a read position use the `--from` flag:

```bash
sdbcli read --from=5 stream_name
```

The position can also be relative from the end by providing a negative value, where `-1` is the last message:

```bash
# read last 10 messages from stream_name
sdbcli read --from=-10 stream_name
```

To follow a stream use the `--follow` flag. This will prevent the `read` command to exit when there are no more messages available and it will wait indefinitely for new messages to arrive.

```bash
# read last message and subscribe to changes
sdbcli read --from=-1 --follow stream_name
```

## List of streams

Use the `streams` command to list the streams in the database:

```bash
sdbcli streams
```

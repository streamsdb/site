---
id: connection-string
title: Connection String
---

This document describes the URI format for defining connections between application and StreamsDB server instances.

The URI connection string scheme has the following format:

```
sdb://[username:password@]host[:port][/database][?options]
```

## Examples

Connection string to host `sdb-01.streamsdb.io` and the database `my-database`

```
sdb://sdb-01.streamsdb.io/my-database
```

Connection including username and password:

```
sdb://demo-user:demo-password@sdb-01.streamsdb.io/my-database
```

## Components

The URI connection string includes the following components:

| Component | Description |
|-----------|-------------|
| sdb:// | A required prefix to identify that this a string in the StreamsDB URI connection string format. |
| username:password@ | **optional** Authentication credentials. If specified that client will attempt to log using these credentials after connecting. If the username or password includes one of the following characters: `@`, `:`, or `/`, use [url encoding](https://urlencode.org/). |
| host[:port] | The host and optional port number where the StreamsDB instance is running. You can specify a hostname, IP address of UNIX domain socket. |
| /database | The name of the database to connect to. |
| ?<option> | **optional** A query string that specifies connection specific options as `<name>=<value>` pairs. See [options](#options) for a full description of these options.

## Options

The following connection string options are available:

| Option | Default | Description |
|--------|---------|-------------|
| insecure | `false` | A boolean value to disable TLS/SSL for the connection. |
| block | `false` | A boolean to enable or disable waiting for the connection to be established when connecting to the StreamsDB server. |
| gzip | `false` | A boolean to enable or disable gzip compression. |

---
id: core-concepts
title: Core Concepts
---

This document described the core concepts of StreamsDB.

## Database

A number of databases can be run on a single StreamsDB server or cluster. 

StreamsDB does not create databases on the fly. An database needs to be created before you can start working with it.

A database can contain multiple streams and an holds a single `$all` stream. The `$all` stream holds pointers to all messages in the database in the order they are written.

## Stream

Streams are the unit of storing messages in StreamsDB. A stream is identified by its name which must be unique within the database. Messages on a stream are strictly ordered.

A stream is append-only meaning you can only append messages the end of the stream. Streams are an important partitioning point in an StreamsDB database. You can reduce contention, and improve performance by deviding your data over multiple stream.

Streams have the following properties:

| Fields  | Type   | Description                                          |
|---------|--------|------------------------------------------------------|
| Name    | string | The unique identifier of the stream                  |
| Head    | number | The number of the message last written to the stream |



## Message

The message is the unit of storing data in StreamsDB database. Messages are immutable, meaning they can only be created or deleted, but not modified.

Messages have the following properties:

| Fields   | Type   | Description                                                                        |
|----------|--------|------------------------------------------------------------------------------------|
| Position | number | The position of the message in the containing stream                               |
| Type     | string | The type of the message, e.q. `MemberRegistered`, `TempratureRegistered`, `String` |
| Header   | Bytes  | Metadata for the message                                                           |
| Value    | Bytes  | The value of the message                                                           |



An message is immutable. It can only be created or deleted. This benefits the cacheability of an messages.
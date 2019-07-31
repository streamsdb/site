---
id: core-concepts
title: Core Concepts
---

This document described the core concepts of StreamsDB.

## Database

A number of databases can be run on a single StreamsDB server or cluster. 

StreamsDB does not create databases on the fly. An database needs to be created before you can start working with it.

A database can contain multiple streams.

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

## Groups

Group streams are streams that hold all messages written to streams in a certain group. The group of a stream is determined by splitting the name of the stream by the **first** `-` character. Streams without a `-` are considered to have no group.

Group streams are prefixed with `#` followed by the group name, eq. `#Order`. They are created automaticly when a message is written to a stream that contains a group.

The group writting is a asynchronous background process. Therefor it might take a short time before message show up on the corresponding group stream.

Here is a concrete example: when message `A` is written to a stream `Order.1` and message `B` is written to `Order.2`, both message `A` and `B` will also appear on the stream `#Order`.

| Stream Name                                  | Group           |
|----------------------------------------------|-----------------|
| `Order`                                      | _no group_      |
| `Order-1`                                    | `#Order`        |
| `Order-2`                                    | `#Order`        |
| `Order-e57ab23e-4ce9-42c8-abe0-c771011b5ffe` | `#Order`        |
| `ShoppingCard-1`                             | `#ShoppingCard` |
| `ShoppingCard-2`                             | `#ShoppingCard` |

> The group of a stream is defined by the **first** `-` character in the stream name. Streams like `shopping-card-1`, `shopping-card-2` and `shopping-card-d1536fee-8800-437f-9718-2b86d015f1fe` have the group `#shopping` and not `#shopping-card`. Therefor we suggest to use the UpperCamelCase naming convention.

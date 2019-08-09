---
id: getting-started-go
title: Getting Started Go
sidebar_label: Go
---

This tutorial will help you get started with the [StreamsDB Go Driver](https://github.com/streamsdb/driver/tree/master/go).

## Install the StreamsDB Go Driver.

Use `go get` to download StreamsDB Go Driver package.

``` BASH
go get github.com/streamsdb/driver
```

The output of this looks like a warning stating it can't load the package. This is expected output since the Go package is not directly located in the root of the repository.

The full package path to import is github.com/streamsdb/driver/go/sdb:

``` golang
import "github.com/streamsdb/driver/go/sdb"
```

## Connecting to StreamsDB

Once the driver has been imported, you can create a client connection to a StreamsDB server using the `sdb.Open()` function that takes a connection string. More information about the connection string can be found in the [connection string reference](/docs/connection-string).

> There should be a single client connection to a StreamsDB server for you entire process. In other words, you should create the client connection on startup and there is no need to create a new client connection for each request.

Add this code in the main function:

``` go
client, err := sdb.Open("sdb://eu.streamsdb.io:443/database_name"")
if err != nil {
  log.Fatal("connect error", err)
}

fmt.Println("Connected to StreamsDB!")
```

## Handle to a database

Once connected, you can get a handle to the a database by using the `DB()` method. Pass a database name, or an empty string if you want to use the database from the connection string.

```
db := client.DB("")
```

## Writing to a stream

With the handle to a database, you can append messages to a stream in that database. Streams do not have to be created explicitly and will be created by StreamsDB whenever the first message is written to it.

Here we write 3 messages with the string values, `hello`, `world` and `!` to the stream `example`. 

``` golang
// append 3 messages to stream
position, err := db.AppendStream("example", sdb.AnyVersion, sdb.MessageInput{
  Type: "string",
  Value: []byte("hello"),
},
sdb.MessageInput{
  Type: "string",
  Value: []byte("world!"),
},
sdb.MessageInput{
  Type: "string",
  Value: []byte("!"),
})

if err != nil {
  log.Fatalf("write error", err)
}

fmt.Println("written to stream at position", position)
```

The `AppendStream()` method returns the position of the first message that has been written to the stream. In StreamsDB the append operation is an [atomic operation](https://en.wikipedia.org/wiki/Atomicity_(database_systems)), either all the messages are written or none in case of an error. Also on a successful write, all messages in a single append operation are written directly after each other. In other words, if the example from above returned position `1`, the next message `world` is at position `2` and `!` at position `3`.

## Reading from a stream

Use the `ReadStreamForward()` method to read from a stream in the forward direction.
In the following example we read the `example` stream from the position we got back from the `AppendStream()` method from the previous example and limit the result to a maximum of 10 messages.

``` go
slice, err := db.ReadStreamForward("example", position, 10)
if err != nil {
  log.Fatal("read error", err)
}

fmt.Println("read from stream from position", slice.From)
for _, message := range slice.Messages {
  fmt.Println("[%v] %s", message.Position, message.Value)
}

// OUTPUT:
// [1] hello
// [2] world
// [3] !
```

## Read stream backwards

In the previous example, we read from a stream in the forwards, meaning from older messages to newer ones. StreamsDB also supports reading in a backward direction, meaning from newer messages to older ones.

Here is an example that reads the `example` stream backward. We specify an offset position of `-1`. A negative position is a position relative from the streams head where the last message in a stream is at position `-1`.

In the slice that is returned, the message positions are not relative, but exact.

``` go
slice, err := db.ReadStreamBackward("example", -1, 10)
if err != nil {
  log.Fatal("read error", err)
}

fmt.Println("read from stream from position", slice.From)
for _, message := range slice.Messages {
  fmt.Println("[%v] %s", message.Position, message.Value)
}

// OUTPUT:
// [3] !
// [2] world
// [1] hello
```

## Resources

* [StreamsDB Go Driver API documentation](https://godoc.org/github.com/streamsdb/driver/go/sdb)
* [StreamsDB Go Driver source code](github.com/streamsdb/driver/go/sdb)
* [StreamsDB Go Driver issues](https://github.com/streamsdb/driver/issues?q=is%3Aopen+is%3Aissue+label%3Ago)

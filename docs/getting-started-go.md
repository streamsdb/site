---
id: getting-started-go
title: Getting Started Go
sidebar_label: Go
---

This tutorial will help you getting started with the [StreamsDB Go Driver](https://github.com/streamsdb/driver/tree/master/go). You will create a simple program and learn how to:

* Install the StreamsDB Go Driver
* Connect to StreamsDB
* Write messages to a stream
* Read messages from a stream
* Subscribe to a stream for changes

You can view the complete code for this tutorial on [this Github repository](https://github.com/streamsdb/driver/tree/master/go/example). In order to follow along, you need a StreamsDB database to which you can connect. You can easily create a free 1GB database using [streamsdb.io](https://streamsdb.io/register).

## Install the StreamsDB Go Driver.

Use `go get` to download StreamsDB Go Driver package.

``` BASH
go get github.com/streamsdb/driver
```

The output of this looks like a warning stating it can't load the package. This is expected output since the Go package is not directly located in the root of the repository.

## Create main.go

Create the file `main.go` and import the `sdb` driver package:

``` GO
package main

import (
    "log"
    "github.com/streamsdb/driver/go/sdb"
)

func main() {
  // rest of the code will go here
}
```

## Connect to StreamsDB

Once the driver has been imported, you can connecto to a StreamsDB server using the `sdb.Connect()` function. You must pass a connection string, you can read more about the [connection string reference](/docs/connection-string).

Add this code in the main function:

``` go
conn, err := sdb.Connect("sdb://sdb-01.streamsdb.io:443/example")
if err != nil {
  log.Fatal("connect error", err)
}

fmt.Println("Connected to StreamsDB!")
```

## Handle to a database

Once you have connected, you can now get a handle to the database by using the `DB()` method. You must pass a database name, or a empty string if you want to use the one from the connection string.

```
db := conn.DB("")
```

## Writing to a stream

You can use the `Append()` method to write to a stream in the database. Streams are automatically created as soon as a message is written to them. After a succesful write the position of the message is returned. This position can later be used to read the message from the stream.

Add the following code at the end of the main function to get a database reference and append a message:

``` go
position, err := db.Append("my-stream", sdb.AnyVersion, sdb.MessageInput{
  Type: "string",
  Value: []byte("hello world!"),
})

if err != nil {
  log.Fatalf("write error", err)
}

fmt.Println("written to stream at position", position)
```

## Reading from a stream

You can use the `Read()` method to read from a stream.

Add the following code at the end of the main function to read from a stream:

``` go
slice, err := db.Read("my-stream", position, 10)
if err != nil {
  log.Fatal("read error", err)
}

fmt.Println("read from stream from position", slice.From)
for _, message := range slice.Messages {
  fmt.Println("[%v] %s", message.Position, message.Value)
}
```

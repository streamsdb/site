---
id: getting-started-dotnet
title: Getting Started .NET
sidebar_label: .NET
---

This tutorial will help you getting started with the [StreamsDB .NET Driver](https://github.com/streamsdb/driver/tree/master/dotnet).

## Installation

The simplest way to get the StreamsDB .NET Driver is by installing the [StreamsDB.Driver NuGet package](https://www.nuget.org/packages/StreamsDB.Driver/).

``` bash
dotnet add package StreamsDB.Client --version 0.9.1-dev.13
```

> The StreamsDB.Client package has a SemVer 2.0.0 package version.
> This package is only available to download with SemVer 2.0.0 compatible 
> NuGet clients, such as Visual Studio 2017 (version 15.3) and above or NuGet client 4.3.0 and above.

The root namespace of the package is StreamsDB.Client:

``` csharp
using StreamsDB.Client;
```

## Connecting

To connect to a StreamsDB database we use the StreamsDBClient class. The constructor of this class accepts a [StreamsDB connection string](/docs/connection-string).

``` csharp
var client = new StreamsDBClient("sdb://eu.streamsdb.io:443/database_name");
```

> There should be a single client connection to a StreamsDB server for you entire process. In other words, you should create the client connection on startup and there is no need to create a new client connection for each request.

## Database

Once connected, you can get a handle to the a database by using the `DB()` method. Pass a database name, or an empty string if you want to use the database from the connection string.

``` csharp
var db = client.DB();
```

## Append to a stream

With the handle to a database you can append messages to a stream in that database. Streams do no have to be created explicitly and will be created by StreamsDB whenever the first message is written to it.

Here we write 3 messages with the string values, `hello`, `world` and `!` to the stream `example`.

``` csharp
var from = await db.AppendStream("example",
  new MessageInput
  {
    Type = "string",
    Value = Encoding.UTF8.GetBytes("hello")
  },
  new MessageInput
  {
    Type = "string",
    Value = Encoding.UTF8.GetBytes("world")
  },
  new MessageInput
  {
    Type = "string",
    Value = Encoding.UTF8.GetBytes("!")
  });
```

The `AppendStream()` method returns the position of the first message that has been written to the stream. All messages in a single append operation are written directly after eachother.

## Reading from a stream

Use the `ReadStreamForward()` to read from a stream in the forward direction.
In this example we read the `example` stream from its first message with a maximum of 10 messages.

``` csharp
var slice = await db.ReadStreamForward("example", 1, 10);
foreach(var message in slice.Messages) {
  var valueAsText = Encoding.UTF8.GetString(message.Value);
  Console.WriteLine($"[{message.Position}] {valueAsText}");
}

Console.WriteLine($"HasNext: {slice.HasNext");

// OUTPUT:
// [1] hello
// [2] world
// [3] !
```

## Opposite direction

You can also read a stream in the opposite direction with `ReadStreamBackward()`. Here we specify `-1` as the position to read from. A negative position represents a relative position from the end where the last message is `-1`. In the slice that is returned, the message positions are not relative, but exact.

``` csharp
var slice = await db.ReadStreamBackward("example", -1, 10);
foreach(var message in slice.Messages) {
  var valueAsText = Encoding.UTF8.GetString(message.Value);
  Console.WriteLine($"[{message.Position}] {valueAsText}");
}

// OUTPUT:
// [3] !
// [2] world
// [1] hello
```

## Continue reading

The slice returned by `ReadStreamForward` and `ReadStreamBackward` has a `HasNext` property indicating whether there are more messages available at the time of reading. You can use this indicator to continue reading if there are more messages available.

``` csharp
// write 1000 messages to the stream
var thousandMessages = Enumerable.Range(1, 1000).Select(n => new MessageInput
{
  Type = "string",
  Value = Encoding.UTF8.GetBytes(n.ToString())
});

db.AppendStream("example", thousandMessages...);

Slice slice;
var from = 1;
do
{
    slice = await db.ReadStreamForward("example", from, 100);

    foreach(var message in slice.Messages) {
      var valueAsText = Encoding.UTF8.GetString(message.Value);
      Console.WriteLine(valueAsText);
    }

    from = slice.Next;
} while (slice.HasNext);

// OUTPUT:
// 1
// 2
// 3
// ...
// 998
// 999
// 1000
```
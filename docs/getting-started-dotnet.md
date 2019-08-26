---
id: getting-started-dotnet
title: Getting Started .NET
sidebar_label: .NET
---

This tutorial will help you get started with the [StreamsDB .NET Driver](https://github.com/streamsdb/driver/tree/master/dotnet).

## Installation

The simplest way to get the StreamsDB .NET Driver is by installing the [StreamsDB.Driver package](https://www.nuget.org/packages/StreamsDB.Driver/).

```bash
dotnet add package StreamsDB.Driver --version 0.9.2-dev.17 
```

> The StreamsDB.Driver package has a SemVer 2.0.0 package version.
> This package is only available to download with SemVer 2.0.0 compatible 
> NuGet clients, such as Visual Studio 2017 (version 15.3) and above or NuGet client 4.3.0 and above.

The root namespace of the package is StreamsDB.Driver:

```c#
using StreamsDB.Driver;
```

## Connecting to StreamsDB

To connect to a StreamsDB database we use the StreamsDBClient class. The constructor of this class accepts a [connection string](/docs/connection-string).

Once connected, you can get a handle to the database by using the `DB()` method:

```c#
// create client connection
var client = StreamsDBClient.Connect("sdb://eu.streamsdb.io:443/database_name");

// get handle to database from the connection string
var db = client.DB();
```

Alternatively you can leave the database from the connection string and pass it to the `DB()` method:

```c#
// create client connection
var client = StreamsDBClient.Connect("sdb://eu.streamsdb.io:443/");

// get handle to specified database
var db = client.DB("database_name");
```

> There should be a single client connection to a StreamsDB server for your entire process. In other words, you should create the client connection on startup and there is no need to create a new client connection for each request.

## Append to a stream

With the handle to a database, you can append messages to a stream in that database. Streams do not have to be created explicitly and will be created by StreamsDB whenever the first message is written to it.

Here we write 3 messages with the string values, `hello`, `world` and `!` to the stream `example`. 

```c#
// append 3 messages to stream
var from = await db.AppendStream("example",
  // 1
  new MessageInput {
    Type = "string",
    Value = Encoding.UTF8.GetBytes("hello")
  },
  // 2
  new MessageInput {
    Type = "string",
    Value = Encoding.UTF8.GetBytes("world")
  },
  // 3
  new MessageInput {
    Type = "string",
    Value = Encoding.UTF8.GetBytes("!")
  });
```

The `AppendStream()` method returns the position of the first message that has been written to the stream. In StreamsDB the append operation is an [atomic operation](https://en.wikipedia.org/wiki/Atomicity_(database_systems)), either all the messages are written or none in case of an error. Also on a successful write, all messages in a single append operation are written directly after each other. In other words, if the example from above returned position `1`, the next message `world` is at position `2` and `!` at position `3`.

## Reading from a stream

Use the `ReadStreamForward()` method to read from a stream in the forward direction.
In the following example we read the `example` stream from the position we got back from the `AppendStream()` method from the previous example and limit the result to a maximum of 10 messages.

```c#
// read from the example stream
var slice = await db.ReadStreamForward("example", from, 10);

// print messages to console
foreach(var message in slice.Messages) {
  var value = Encoding.UTF8.GetString(message.Value)
  Console.WriteLine($"[{0}] {1}", message.Position, value);
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

```c#
// read from the example stream
var slice = await db.ReadStreamBackward("example", -1, 10);

// print messages to console
foreach(var message in slice.Messages) {
  var value = Encoding.UTF8.GetString(message.Value)
  Console.WriteLine($"[{0}] {1}", message.Position, value);
}

// OUTPUT:
// [3] !
// [2] world
// [1] hello
```

## Read continuation

The slice returned by reading operations has a `HasNext` property indicating whether there are more messages available at the time of reading. You can use this indicator to continue reading when there are more messages.

```c#
// create 1000 messages to write to the stream
var thousandMessages = Enumerable.Range(1, 1000).Select(n => new MessageInput
{
  Type = "string",
  Value = Encoding.UTF8.GetBytes(n.ToString())
});

// write messages to the stream
await db.AppendStream("example", thousandMessages);

var from = 1;
Slice slice;
do
{
  // read from the stream
  slice = await db.ReadStreamForward("example", from, 100);

  // print messages to console
  foreach(var message in slice.Messages) {
    var value = Encoding.UTF8.GetString(message.Value)
    Console.WriteLine($"[{0}] {1}", message.Position, value);
  }

  // advance from to the next position
  from = slice.Next;
} while (slice.HasNext);

// OUTPUT:
// 1
// 2
// 3
// ...
// 999
// 1000
```

## Subscribe to a stream

You can also subscribe to a stream for changes. Here is an example that subscribes to the `example` stream from the beginning. Existing messages will be delivered immediately and the enumerator will block on `MoveNext()` till new messages are written to the stream.

```c#
// create a subscription to the example stream
var cursor = db.SubscribeStream(streamName, -1);

// move to the next available message
while (await cursor.MoveNext(CancellationToken.None))
{
  // get the current message from the cursor
  var message = cursor.Current;

  // print message to console
  var value = Encoding.UTF8.GetString(message.Value)
  Console.WriteLine($"[{0}] {1}", message.Position, value);
}
```

## Optimistic concurrency

Writing supports an optimistic concurrency check on the version of the stream to which events are written. With this check, you can make sure your messages are not written if a stream has changed since the last time you read from it.

There is an overload of the `AppendStream()` method that accepts a `ConcurrencyCheck`. You can use this parameter to set the expectation of the stream. Use one of the following methods of the `ConcurrencyCheck` class to specify an optimistic concurrency check:

| Method                                        | Description                                                       |
|-----------------------------------------------|-------------------------------------------------------------------|
| `ConcurrencyCheck.Skip()`                     | skip optimistic concurrency check                                 |
| `ConcurrencyCheck.ExpectVersion(long)`        | expect the stream at the specified version                        |
| `ConcurrencyCheck.ExpectLastMessage(Message)` | expect the last message on the stream to be the specified message |

Here is an example that writes a strict monotonically increasing number to a stream. Because of the `ConcurrencyCheck` this example could be run concurrently and the numbers on the steam will still be monotonicly increasing:

```c#
int nextNumber;
ConcurrencyCheck check;

while (true) {
  // read the last message from the stream
  var (message, found) = await db.ReadMessageFromStream("exact-sequence", -1);

  if (found)
  {
    // get the number from the value of the last message and increase
    nextNumber = BitConverter.ToInt32(message.Value) + 1;

    // expect the message we read to be the last message on the stream
    check = ConcurrencyCheck.ExpectLastMessage(message);
  }
  else
  {
    nextNumber = 0;
    check = ConcurrencyCheck.ExpectVersion(0);
  }

  try {
    await db.AppendStream("exact-sequence", check, new MessageInput
    {
      Type = "int32",
      Value = BitConverter.GetBytes(nextNumber)
    });
  } catch(OperationAbortedException caught) {
    // The operation was aborted, typically due to
    // a concurrency issue such as a concurrency check failure.
    continue;
  }
}
```

## Resources

* [StreamsDB.Driver package](https://www.nuget.org/packages/StreamsDB.Driver/)
* [StreamsDB.Driver source code](https://github.com/streamsdb/driver/tree/master/dotnet)
* [StreamsDB.Driver issues](https://github.com/streamsdb/driver/issues?q=is%3Aopen+is%3Aissue+label%3Adotnet)

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

The easiest way to use `sdbcli` is via Docker. To use it create an alias that runs the [`streamsdb/sdbcli`](https://hub.docker.com/r/streamsdb/sdbcli) docker image by executing the following command:

``` BASH
alias sdbcli='docker run -it streamsdb/sdbcli --host "sdb://sdb-01.streamsdb.io:443/default?tls=1&block=1"'
```

Now we can ping StreamsDB to verify we can reach the default server:

``` BASH
sdbcli ping
```

The ping command should reply with the roundtrip duration.

## Append your first event

We will now use the `append` command to write an event message to a stream. Its syntax is `sdbcli append <STREAM> <EVENTTYPE> <VALUE>`.

The `<SREAM>` argument is the name of the stream, the `<EVENTTYPE>` argument the name of the type of the event and the `<VALUE>` argument can either be a string value, or `-` to read from STDIN.

Execute the following command to append the value "HELLO WORLD" to the "welcome" stream:

``` BASH
sdbcli append "welcome" "string" "HELLO WORLD"
```

It should respond with a number. This is the position of the message in the stream we just wrote.

## Nulla

Nulla facilisi. Maecenas sodales nec purus eget posuere. Sed sapien quam, pretium a risus in, porttitor dapibus erat. Sed sit amet fringilla ipsum, eget iaculis augue. Integer sollicitudin tortor quis ultricies aliquam. Suspendisse fringilla nunc in tellus cursus, at placerat tellus scelerisque. Sed tempus elit a sollicitudin rhoncus. Nulla facilisi. Morbi nec dolor dolor. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Cras et aliquet lectus. Pellentesque sit amet eros nisi. Quisque ac sapien in sapien congue accumsan. Nullam in posuere ante. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Proin lacinia leo a nibh fringilla pharetra.

## Orci

Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Proin venenatis lectus dui, vel ultrices ante bibendum hendrerit. Aenean egestas feugiat dui id hendrerit. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Curabitur in tellus laoreet, eleifend nunc id, viverra leo. Proin vulputate non dolor vel vulputate. Curabitur pretium lobortis felis, sit amet finibus lorem suscipit ut. Sed non mollis risus. Duis sagittis, mi in euismod tincidunt, nunc mauris vestibulum urna, at euismod est elit quis erat. Phasellus accumsan vitae neque eu placerat. In elementum arcu nec tellus imperdiet, eget maximus nulla sodales. Curabitur eu sapien eget nisl sodales fermentum.

## Phasellus

Phasellus pulvinar ex id commodo imperdiet. Praesent odio nibh, sollicitudin sit amet faucibus id, placerat at metus. Donec vitae eros vitae tortor hendrerit finibus. Interdum et malesuada fames ac ante ipsum primis in faucibus. Quisque vitae purus dolor. Duis suscipit ac nulla et finibus. Phasellus ac sem sed dui dictum gravida. Phasellus eleifend vestibulum facilisis. Integer pharetra nec enim vitae mattis. Duis auctor, lectus quis condimentum bibendum, nunc dolor aliquam massa, id bibendum orci velit quis magna. Ut volutpat nulla nunc, sed interdum magna condimentum non. Sed urna metus, scelerisque vitae consectetur a, feugiat quis magna. Donec dignissim ornare nisl, eget tempor risus malesuada quis.

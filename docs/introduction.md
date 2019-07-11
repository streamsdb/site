---
id: introduction
title: Introduction
---

This document describes what StreamsDB is and why it was created.

## What

StreamsDB is a modern streams database that can handle billions of streams and trillions messages. It provides a rock solid foundation for event sourced and stream processing applications and comes with strong transactional garantees out of the box.

### Transactions

The StreamsDB transactional model ensures the following properties, known collectively as “ACID”:

* atomicity: either all of the writes in the transaction happen, or none of them happen.
* consistency: if each individual transaction maintains a database invariant then the invariant is maintained even when multiple transactions are modifying the database concurrently.
* isolation: it is as if transactions executed one at a time (serializability).
* durability: once a transaction succeeds, its writes will not be lost despite any failures or network partitions.

An additional important property, though technically not part of ACID, is also guaranteed:

* causality: a transaction is guaranteed to see the effects of all other transactions that commit before it begins.
---
id: introduction
title: Introduction
---

This document describes what StreamsDB is and why it was created.

## What

StreamsDB is a modern streams database that can handle billions of streams and trillions messages. It provides a rock solid foundation for event sourced and stream processing applications and comes with strong transactional garantees out of the box.

## Event Sourcing

The fundamental idea of Event Sourcing is that of ensuring every change to the state of an application is captured in an event object, and that these event objects are themselves stored in the sequence they were applied.

Event Sourcing ensures that all changes to application state are stored as a sequence of events. Not just can we query these events, we can also use the event log to reconstruct past states, and as a foundation to automatically adjust the state to cope with retroactive changes.

### Transactions

The StreamsDB transactional model ensures the following properties, known collectively as “ACID”:

* atomicity: either all of the writes in the transaction happen, or none of them happen.
* consistency: if each individual transaction maintains a database invariant then the invariant is maintained even when multiple transactions are modifying the database concurrently.
* isolation: it is as if transactions executed one at a time (serializability).
* durability: once a transaction succeeds, its writes will not be lost despite any failures or network partitions.

An additional important property, though technically not part of ACID, is also guaranteed:

* causality: a transaction is guaranteed to see the effects of all other transactions that commit before it begins.
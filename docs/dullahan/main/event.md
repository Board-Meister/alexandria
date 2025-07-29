---
sidebar_position: 3
sidebar_label: 'Events'
---

# Events

To help creating events Main Bundle comes with two abstracts: `EventAbstract` and `SagaAbstract`.

## EventAbstract

`EventAbstract` implements `PreventableEventInterface` from the start and has `Context` class from the start.
It is a great start for new Bundle default events.

## SagaAbstract

`SagaAbstract` is an extension of the `EventAbstract` and help with defining valid Saga events - requires a
`RequestInterface` and already has prepared place for the `Response` object.

## Saga not handled

When Saga event finishes but doesn't have `Response` set service should throw
`Dullahan\Main\Exception\SagaNotHandledException` which is 500 exception, as it means that core event was not handled.